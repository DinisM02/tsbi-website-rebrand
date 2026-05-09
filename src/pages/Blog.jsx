import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import { getPublishedBlogPosts } from '../firebase/firestore';
import ScrollIndicator from '../components/ScrollIndicator';

// Artigos estÃ¡ticos exibidos enquanto nÃ£o hÃ¡ posts no Firestore
const STATIC_POSTS = [
  {
    id: 'static-1',
    title: 'Flood Preparedness: 10 Essentials Every Family Should Have',
    excerpt: 'A practical checklist to prepare your home and family before flood season begins. Know the signs, build a plan, and act fast.',
    content: `Flood readiness starts well before the rain arrives. Here are the 10 essentials every household should have ready:

1. Go-bag with 72-hour supplies (food, water, medication, documents)
2. Emergency contact list â€” printed, not just digital
3. Waterproof container for vital documents (ID, insurance, passports)
4. First aid kit fully stocked
5. Battery-powered or hand-crank radio
6. Flashlights and extra batteries
7. Waterproof boots and rain gear for all family members
8. Evacuation route planned (at least two alternatives)
9. Safe meeting point known by all family members
10. HydroBeacon app alerts enabled for your location

Review your plan every flood season and keep supplies refreshed.`,
    category: 'Preparedness',
    author: 'HydroBeacon Team',
    image: 'https://images.unsplash.com/photo-1527489377706-5bf97e608852?auto=format&fit=crop&w=1200&q=80',
    createdAt: { seconds: 1745000000 },
    _static: true,
  },
  {
    id: 'static-2',
    title: 'How Community Response Teams Reduce Flood Risk',
    excerpt: 'Why local coordination can save lives during heavy rainfall events. Lessons from communities that got it right.',
    content: `When a flood strikes, the first response almost always comes from neighbors, not government agencies.

Community Response Teams (CRTs) are trained volunteers who:
- Conduct door-to-door welfare checks in high-risk zones
- Guide vulnerable residents to nearby shelters
- Relay real-time information to emergency dispatch
- Distribute emergency supplies in the critical first hours

Studies show CRTs reduce casualty rates by up to 40% in areas with frequent flooding.

HydroBeacon supports CRT formation through our training programs and the real-time communication tools built into our platform. If you'd like to start or join a CRT in your area, visit our Volunteer Opportunities page.`,
    category: 'Community',
    author: 'HydroBeacon Operations',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    createdAt: { seconds: 1744000000 },
    _static: true,
  },
  {
    id: 'static-3',
    title: 'Understanding Flood Risk Levels: Low, Medium, High and Critical',
    excerpt: 'What do the HydroBeacon alert severity levels actually mean? A practical guide to interpreting flood risk data.',
    content: `The HydroBeacon platform uses a four-tier severity system to communicate flood risk clearly and consistently:

ðŸŸ¢ LOW â€” River discharge below 40 mÂ³/s, rainfall under 10 mm/h. Normal conditions. Continue monitoring.

ðŸŸ¡ MEDIUM â€” River discharge 40â€“60 mÂ³/s or rainfall 10â€“20 mm/h. Elevated risk. Review your evacuation plan and prepare your go-bag.

ðŸ”´ HIGH â€” River discharge above 60 mÂ³/s or rainfall above 20 mm/h. Imminent danger in low-lying areas. Be ready to evacuate on short notice.

ðŸš¨ CRITICAL â€” Extreme conditions. Immediate evacuation required. Follow instructions from emergency services.

These thresholds are calibrated using data from OpenWeatherMap and the Open-Meteo global river discharge monitoring system, updated every 2 minutes.`,
    category: 'Safety',
    author: 'HydroBeacon Data Team',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80',
    createdAt: { seconds: 1743000000 },
    _static: true,
  },
];

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await getPublishedBlogPosts();
      // Use static posts as fallback when Firestore has no content yet
      setPosts(data.length > 0 ? data : STATIC_POSTS);
    } catch (err) {
      console.error('Error loading blog posts:', err);
      setPosts(STATIC_POSTS);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return '';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  // Single post view
  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-primary hover:underline mb-6 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </button>

          {(selectedPost.imageUrl || selectedPost.image) && (
            <img
              src={selectedPost.imageUrl || selectedPost.image}
              alt={selectedPost.title}
              className="w-full h-64 md:h-80 object-cover rounded-xl mb-6"
              loading="eager"
              decoding="async"
            />
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{selectedPost.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8">
            {selectedPost.author && (
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {selectedPost.author}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(selectedPost.createdAt)}
            </span>
            {selectedPost.category && (
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {selectedPost.category}
              </span>
            )}
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
            {selectedPost.content}
          </div>
        </div>
        <ScrollIndicator />
      </div>
    );
  }

  // Blog listing
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Insights, news, and updates on flood safety, disaster preparedness, and community resilience.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Posts Yet</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              No articles have been published yet. You can explore training materials now or contact HydroBeacon for updates and tailored resources.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/training" className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90">
                Explore Training
              </Link>
              <Link to="/contact" className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Request Updates
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              >
                {(post.imageUrl || post.image) ? (
                  <img src={post.imageUrl || post.image} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-primary/30" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    {post.category && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">{post.category}</span>
                    )}
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
                  )}
                  {post.author && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">{post.author.charAt(0)}</span>
                      </div>
                      {post.author}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <ScrollIndicator />
    </div>
  );
};

export default Blog;



