import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, FileText, Plus, Edit, Trash2, Eye, EyeOff, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '../../firebase/firestore';
import { uploadBlogImage } from '../../firebase/storage';
import ScrollIndicator from '../../components/ScrollIndicator';

const AdminBlog = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    imageFile: null,
    imageUrl: '',
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await getBlogPosts();
      setPosts(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setFormData({ title: '', excerpt: '', content: '', category: '', author: '', imageFile: null, imageUrl: '' });
    setEditingId(null);
    setShowForm(false);
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleEdit = (post) => {
    setFormData({
      title: post.title || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      category: post.category || '',
      author: post.author || '',
      imageFile: null,
      imageUrl: post.imageUrl || post.image || '',
    });
    setEditingId(post.id);
    setShowForm(true);
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');
    try {
      let imageUrl = formData.imageUrl;
      if (formData.imageFile) {
        imageUrl = await uploadBlogImage(formData.imageFile);
      }
      const postData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        author: formData.author,
        imageUrl,
      };
      if (editingId) {
        await updateBlogPost(editingId, postData);
        setSubmitSuccess(t('adminBlogPage.messages.updated'));
      } else {
        await createBlogPost(postData);
        setSubmitSuccess(t('adminBlogPage.messages.published'));
      }
      await loadData();
      resetForm();
    } catch (err) {
      console.error(err);
      if (err.code === 'storage/not-configured') {
        setSubmitError(t('adminBlogPage.messages.storageNotConfigured'));
      } else {
        setSubmitError(t('adminBlogPage.messages.saveFailed'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('adminBlogPage.confirmDelete'))) return;
    try {
      await deleteBlogPost(id);
      await loadData();
    } catch (err) { console.error(err); }
  };

  const handleTogglePublish = async (post) => {
    try {
      await updateBlogPost(post.id, { published: !post.published });
      await loadData();
    } catch (err) { console.error(err); }
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return t('adminBlogPage.notAvailable');
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                {t('adminBlogPage.title')}
              </h1>
              <p className="text-sm text-gray-500">{posts.length} {t('adminBlogPage.postsCountLabel')}</p>
            </div>
          </div>
          <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            {t('adminBlogPage.newPost')}
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{editingId ? t('adminBlogPage.form.editPost') : t('adminBlogPage.form.createPost')}</h2>
              <button onClick={resetForm} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {submitError}
                </div>
              )}
              {submitSuccess && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {submitSuccess}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">{t('adminBlogPage.form.fields.title')} *</Label>
                  <Input value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} className="mt-1" placeholder={t('adminBlogPage.form.placeholders.title')} />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">{t('adminBlogPage.form.fields.category')}</Label>
                  <Input value={formData.category} onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))} className="mt-1" placeholder={t('adminBlogPage.form.placeholders.category')} />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">{t('adminBlogPage.form.fields.author')}</Label>
                  <Input value={formData.author} onChange={(e) => setFormData(p => ({ ...p, author: e.target.value }))} className="mt-1" placeholder={t('adminBlogPage.form.placeholders.author')} />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">{t('adminBlogPage.form.fields.coverImage')}</Label>
                  <Input type="file" accept="image/*" onChange={(e) => setFormData(p => ({ ...p, imageFile: e.target.files[0] }))} className="mt-1" />
                  <p className="mt-1 text-xs text-gray-500">{t('adminBlogPage.form.coverImageHelp')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">{t('adminBlogPage.form.fields.imageUrl')}</Label>
                  <Input value={formData.imageUrl} onChange={(e) => setFormData(p => ({ ...p, imageUrl: e.target.value }))} className="mt-1" placeholder={t('adminBlogPage.form.placeholders.imageUrl')} />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">{t('adminBlogPage.form.fields.excerpt')}</Label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData(p => ({ ...p, excerpt: e.target.value }))}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  rows={2}
                  placeholder={t('adminBlogPage.form.placeholders.excerpt')}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">{t('adminBlogPage.form.fields.content')} *</Label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  rows={10}
                  placeholder={t('adminBlogPage.form.placeholders.content')}
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90 text-white">
                  {submitting ? t('adminBlogPage.form.saving') : editingId ? t('adminBlogPage.form.updatePost') : t('adminBlogPage.form.publishPost')}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>{t('adminBlogPage.form.cancel')}</Button>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-3">
          {posts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-12 text-center text-gray-500">
              {t('adminBlogPage.emptyState')}
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-start gap-4">
                {(post.imageUrl || post.image) && (
                  <img src={post.imageUrl || post.image} alt="" className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{post.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        {post.author && <span>{t('adminBlogPage.byAuthor', { author: post.author })}</span>}
                        {post.category && <span className="px-2 py-0.5 bg-gray-100 rounded-full">{post.category}</span>}
                        <span>{formatDate(post.createdAt)}</span>
                        <span className={`px-2 py-0.5 rounded-full ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {post.published ? t('adminBlogPage.status.published') : t('adminBlogPage.status.draft')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => handleTogglePublish(post)} className="p-2 hover:bg-gray-100 rounded-lg" title={post.published ? t('adminBlogPage.actions.unpublish') : t('adminBlogPage.actions.publish')}>
                        {post.published ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
                      </button>
                      <button onClick={() => handleEdit(post)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  {post.excerpt && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{post.excerpt}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <ScrollIndicator />
    </div>
  );
};

export default AdminBlog;
