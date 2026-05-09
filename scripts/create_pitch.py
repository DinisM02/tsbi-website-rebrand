"""
TSBI Pitch PowerPoint Generator
Gera apresentação em Português para entidades governamentais e ONGs
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt
import os

# ── Paleta de cores TSBI ──────────────────────────────────────────────
BLUE       = RGBColor(0x00, 0x84, 0xB6)   # #0084B6  (azul principal)
DARK_BLUE  = RGBColor(0x00, 0x4A, 0x70)   # #004A70  (azul escuro)
WHITE      = RGBColor(0xFF, 0xFF, 0xFF)
LIGHT_GRAY = RGBColor(0xF4, 0xF7, 0xFA)
MID_GRAY   = RGBColor(0x64, 0x74, 0x8B)
DARK_GRAY  = RGBColor(0x1E, 0x29, 0x3B)
ACCENT     = RGBColor(0xFF, 0xA5, 0x00)   # laranja destaque

# ── Helpers ───────────────────────────────────────────────────────────
def add_rect(slide, l, t, w, h, fill_color=None, line_color=None, line_width=Pt(0)):
    from pptx.util import Emu
    shape = slide.shapes.add_shape(1, Inches(l), Inches(t), Inches(w), Inches(h))
    shape.line.width = line_width
    if fill_color:
        shape.fill.solid()
        shape.fill.fore_color.rgb = fill_color
    else:
        shape.fill.background()
    if line_color:
        shape.line.color.rgb = line_color
    else:
        shape.line.fill.background()
    return shape

def add_text_box(slide, text, l, t, w, h,
                 font_size=Pt(12), bold=False, color=DARK_GRAY,
                 align=PP_ALIGN.LEFT, italic=False, wrap=True):
    txBox = slide.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h))
    txBox.word_wrap = wrap
    tf = txBox.text_frame
    tf.word_wrap = wrap
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = font_size
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = color
    return txBox

def set_slide_bg(slide, color):
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = color

def add_header_band(slide, title, subtitle=None,
                    bg=BLUE, title_color=WHITE, sub_color=WHITE):
    """Barra de cabeçalho azul no topo do slide."""
    add_rect(slide, 0, 0, 10, 1.55, fill_color=bg)
    add_text_box(slide, title, 0.4, 0.18, 9.2, 0.7,
                 font_size=Pt(28), bold=True, color=title_color, align=PP_ALIGN.LEFT)
    if subtitle:
        add_text_box(slide, subtitle, 0.4, 0.85, 9.2, 0.5,
                     font_size=Pt(13), bold=False, color=sub_color, align=PP_ALIGN.LEFT)

def bullet_card(slide, title, bullets, l, t, w, h,
                title_color=BLUE, bullet_color=DARK_GRAY, bg=WHITE):
    add_rect(slide, l, t, w, h, fill_color=bg, line_color=RGBColor(0xDD, 0xE5, 0xEE), line_width=Pt(1))
    add_text_box(slide, title, l+0.15, t+0.12, w-0.3, 0.38,
                 font_size=Pt(13), bold=True, color=title_color)
    body = "\n".join(f"• {b}" for b in bullets)
    add_text_box(slide, body, l+0.15, t+0.52, w-0.3, h-0.65,
                 font_size=Pt(11), color=bullet_color, wrap=True)

def stat_card(slide, number, label, l, t, w=2.1, h=1.3, bg=BLUE):
    add_rect(slide, l, t, w, h, fill_color=bg)
    add_text_box(slide, number, l, t+0.12, w, 0.55,
                 font_size=Pt(30), bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    add_text_box(slide, label, l, t+0.65, w, 0.5,
                 font_size=Pt(11), color=WHITE, align=PP_ALIGN.CENTER)

def accent_line(slide, t=1.55):
    add_rect(slide, 0, t, 10, 0.04, fill_color=ACCENT)

# ══════════════════════════════════════════════════════════════════════
#  SLIDES
# ══════════════════════════════════════════════════════════════════════

def slide_cover(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # blank
    set_slide_bg(slide, DARK_BLUE)

    # Gradiente visual — dois retângulos sobrepostos
    add_rect(slide, 0, 0, 10, 7.5, fill_color=DARK_BLUE)
    add_rect(slide, 0, 4.2, 10, 3.3, fill_color=RGBColor(0x00, 0x3A, 0x5C))

    # Linha de destaque laranja
    add_rect(slide, 0.5, 2.95, 1.2, 0.07, fill_color=ACCENT)

    # Logo / sigla
    add_text_box(slide, "TSBI", 0.5, 0.4, 4, 0.9,
                 font_size=Pt(48), bold=True, color=ACCENT, align=PP_ALIGN.LEFT)
    add_text_box(slide, "The Safety Beacon Initiative", 0.5, 1.22, 8, 0.55,
                 font_size=Pt(18), bold=False, color=WHITE, align=PP_ALIGN.LEFT)

    # Linha divisória
    add_rect(slide, 0.5, 1.82, 9, 0.035, fill_color=RGBColor(0x00, 0x84, 0xB6))

    # Título principal
    add_text_box(slide, "Proteção Comunitária\nContra Cheias", 0.5, 1.95, 9, 1.2,
                 font_size=Pt(34), bold=True, color=WHITE, align=PP_ALIGN.LEFT)

    # Subtítulo
    add_text_box(slide,
        "Plataforma de Alerta Precoce, Resposta a Emergências\ne Formação VR/AR para Comunidades Vulneráveis",
        0.5, 3.18, 9, 0.9,
        font_size=Pt(14), color=RGBColor(0xB0, 0xD4, 0xE8), align=PP_ALIGN.LEFT)

    # Rodapé
    add_text_box(slide, "Proposta de Parceria Institucional  •  Abril 2026",
                 0.5, 6.8, 9, 0.45,
                 font_size=Pt(11), color=RGBColor(0x77, 0xA8, 0xC4), align=PP_ALIGN.LEFT)
    add_text_box(slide, "thesafetybeaconinitiative@gmail.com",
                 6.2, 6.8, 3.5, 0.45,
                 font_size=Pt(11), color=RGBColor(0x77, 0xA8, 0xC4), align=PP_ALIGN.RIGHT)


def slide_problema(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, LIGHT_GRAY)
    add_header_band(slide, "O Problema", "As cheias são o desastre natural mais frequente e letal no mundo")
    accent_line(slide)

    stats = [
        ("1.5 B", "pessoas em risco\nde cheia até 2030"),
        ("$1 Tri", "perdas económicas\npor ano a nível global"),
        ("90%", "das catástrofes\nnaturais envolvem água"),
        ("72 h", "margem crítica de\naviso prévio ausente"),
    ]
    x = 0.4
    for num, lbl in stats:
        stat_card(slide, num, lbl, x, 1.85, w=2.1, h=1.45)
        x += 2.28

    bullets_left = [
        "Comunidades rurais e periurbanas recebem alertas tarde ou nunca",
        "Sistemas existentes são fragmentados, caros e inacessíveis",
        "Falta de formação prática para a população e primeiros socorristas",
        "Dados de risco dispersos por múltiplas entidades sem integração",
    ]
    bullets_right = [
        "Portugal: cheias responsáveis por 60 % das mortes por catástrofe",
        "Brasil: 8 dos 10 desastres mais mortais nos últimos 20 anos são cheias",
        "Tempo médio de evacuação ainda depende de chamadas telefónicas manuais",
        "Populações vulneráveis (idosos, deficientes) raramente cobertas",
    ]
    bullet_card(slide, "Contexto Global", bullets_left,  0.4, 3.45, 4.45, 3.0)
    bullet_card(slide, "Realidade Local",  bullets_right, 5.15, 3.45, 4.45, 3.0)


def slide_solucao(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, WHITE)
    add_header_band(slide, "A Nossa Solução",
                    "Plataforma integrada de monitorização, alerta e formação em tempo real")
    accent_line(slide)

    pilares = [
        ("🛰️ Monitorização\nem Tempo Real",
         ["Dados de OpenWeatherMap, Open-Meteo Flood API e sensores IoT",
          "Atualização a cada 2 minutos",
          "Cobertura de chuva, vento, nível do rio e risco de cheia"]),
        ("🔔 Alertas\nMulticanal",
         ["SMS, email, notificações push e painel interno",
          "Segmentação por zona geográfica e nível de risco",
          "Alertas diferenciados para residentes, socorristas e voluntários"]),
        ("🗺️ Mapas\nInterativos",
         ["Mapa ao vivo com zonas de risco e rotas de evacuação",
          "Localização de abrigos via OpenStreetMap",
          "Rotas internas calculadas em tempo real"]),
        ("🥽 Formação\nVR / AR",
         ["Simulações imersivas de resposta a emergências",
          "Cenários: cheia relâmpago, abrigo de emergência",
          "Certificações para voluntários e socorristas"]),
    ]

    x_positions = [0.25, 2.6, 4.95, 7.3]
    for (titulo, buls), x in zip(pilares, x_positions):
        add_rect(slide, x, 1.65, 2.35, 4.95, fill_color=LIGHT_GRAY,
                 line_color=RGBColor(0xCC, 0xDD, 0xEE), line_width=Pt(1))
        add_text_box(slide, titulo, x+0.12, 1.75, 2.1, 0.75,
                     font_size=Pt(13), bold=True, color=BLUE)
        body = "\n".join(f"• {b}" for b in buls)
        add_text_box(slide, body, x+0.12, 2.52, 2.1, 3.9,
                     font_size=Pt(10.5), color=DARK_GRAY, wrap=True)

    add_text_box(slide,
        "Arquitetura cloud-first • Firebase + React + Vite • Suporte offline • Acessível em qualquer dispositivo",
        0.3, 6.75, 9.4, 0.45,
        font_size=Pt(10.5), color=MID_GRAY, align=PP_ALIGN.CENTER, italic=True)


def slide_impacto(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, LIGHT_GRAY)
    add_header_band(slide, "Impacto Esperado", "Métricas de resultado ao fim de 12 meses de operação")
    accent_line(slide)

    stats2 = [
        ("500 K+", "Vidas protegidas\nna fase piloto"),
        ("200+",   "Comunidades\ncobertas"),
        ("95 %",   "Precisão alvo\ndos alertas"),
        ("24 / 7", "Monitorização\ncontínua"),
    ]
    x = 0.4
    for num, lbl in stats2:
        stat_card(slide, num, lbl, x, 1.85, w=2.1, h=1.45, bg=DARK_BLUE)
        x += 2.28

    add_text_box(slide, "Benefícios Diretos para Parceiros Institucionais",
                 0.4, 3.48, 9.2, 0.42,
                 font_size=Pt(15), bold=True, color=DARK_BLUE)

    beneficios = [
        ("Para Entidades Governamentais",
         ["Redução do tempo de resposta a emergências",
          "Painel de comando operacional em tempo real",
          "Relatórios e trilha de auditoria para prestação de contas",
          "Integração com Proteção Civil e Defesa Civil existentes"]),
        ("Para ONGs e Organizações Humanitárias",
         ["Coordenação de voluntários e doações na plataforma",
          "Acesso a dados de vulnerabilidade por zona",
          "Ferramenta de alcance comunitário e tradução",
          "Formação certificada para equipas no terreno"]),
        ("Para a Comunidade",
         ["Alertas gratuitos e acessíveis via telemóvel",
          "Localização imediata de abrigos próximos",
          "Formação prática sem custo para residentes",
          "Canal de reporte de perigos e SOS integrado"]),
    ]
    x = 0.4
    for titulo, buls in beneficios:
        bullet_card(slide, titulo, buls, x, 3.95, 2.9, 3.0)
        x += 3.1


def slide_tecnologia(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, WHITE)
    add_header_band(slide, "Tecnologia & Segurança",
                    "Infraestrutura robusta, escalável e conforme com normas de proteção de dados")
    accent_line(slide)

    stack = [
        ("Frontend", "React + Vite\nPWA (offline-ready)\nAcessível em qualquer browser"),
        ("Backend",  "Firebase Auth\nFirestore (NoSQL)\nCloud Functions"),
        ("APIs de Dados", "OpenWeatherMap\nOpen-Meteo Flood\nOpenStreetMap / Overpass"),
        ("Segurança", "Regras Firestore\nAutenticação por função\nAuditoria de acessos"),
        ("Infraestrutura", "Google Cloud Platform\nVercel CDN global\nBackups automáticos"),
    ]

    x = 0.3
    for titulo, corpo in stack:
        add_rect(slide, x, 1.72, 1.82, 3.2, fill_color=LIGHT_GRAY,
                 line_color=RGBColor(0xCC, 0xDD, 0xEE), line_width=Pt(1))
        add_text_box(slide, titulo, x+0.1, 1.82, 1.62, 0.42,
                     font_size=Pt(12), bold=True, color=BLUE)
        add_text_box(slide, corpo, x+0.1, 2.28, 1.62, 2.5,
                     font_size=Pt(10.5), color=DARK_GRAY, wrap=True)
        x += 1.94

    compliance_items = [
        "✅  RGPD / LGPD — dados pessoais minimizados e encriptados",
        "✅  Acesso baseado em funções (residente, socorrista, voluntário, admin)",
        "✅  Código aberto disponível para auditoria técnica independente",
        "✅  Operação multi-idioma (Português e Inglês) — expansível",
        "✅  Nenhum dado sensível armazenado sem consentimento explícito",
    ]
    add_text_box(slide, "Conformidade e Boas Práticas",
                 0.4, 5.05, 9.2, 0.42,
                 font_size=Pt(14), bold=True, color=DARK_BLUE)
    body = "\n".join(compliance_items)
    add_text_box(slide, body, 0.4, 5.52, 9.2, 1.7,
                 font_size=Pt(11), color=DARK_GRAY, wrap=True)


def slide_parceiros(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, LIGHT_GRAY)
    add_header_band(slide, "Modelo de Parceria",
                    "Como pode a sua organização participar e beneficiar")
    accent_line(slide)

    niveis = [
        ("🥇 Parceiro Fundador", ACCENT,
         ["Co-branding na plataforma e materiais de comunicação",
          "Acesso prioritário a dados e relatórios de impacto",
          "Voto consultivo no roteiro de funcionalidades",
          "Reconhecimento em todos os eventos e publicações TSBI",
          "Integração técnica personalizada com sistemas existentes"],
         "Financiamento ou recursos ≥ €50 000 / ano"),
        ("🥈 Parceiro Estratégico", BLUE,
         ["Logótipo e menção em plataforma e redes sociais",
          "Relatórios trimestrais de impacto e utilização",
          "Acesso a dashboard de comandante para gestão de emergências",
          "Participação em pilotos e estudos de caso conjuntos"],
         "Financiamento ou recursos €10 000 – €50 000 / ano"),
        ("🥉 Parceiro Apoiante", DARK_BLUE,
         ["Menção em página de parceiros do website",
          "Acesso a dados agregados e anonimizados",
          "Convite para eventos e demonstrações TSBI"],
         "Financiamento ou recursos < €10 000 / ano"),
    ]

    x = 0.3
    for titulo, cor, buls, condicao in niveis:
        add_rect(slide, x, 1.72, 3.05, 5.3, fill_color=WHITE,
                 line_color=cor, line_width=Pt(2))
        add_rect(slide, x, 1.72, 3.05, 0.5, fill_color=cor)
        add_text_box(slide, titulo, x+0.1, 1.76, 2.85, 0.42,
                     font_size=Pt(12), bold=True, color=WHITE)
        body = "\n".join(f"• {b}" for b in buls)
        add_text_box(slide, body, x+0.12, 2.28, 2.8, 3.8,
                     font_size=Pt(10.5), color=DARK_GRAY, wrap=True)
        add_rect(slide, x+0.12, 6.55, 2.8, 0.35, fill_color=LIGHT_GRAY)
        add_text_box(slide, condicao, x+0.15, 6.58, 2.74, 0.3,
                     font_size=Pt(9.5), bold=True, color=cor, italic=True)
        x += 3.22


def slide_roadmap(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, WHITE)
    add_header_band(slide, "Roteiro de Implementação",
                    "Plano faseado de 18 meses para lançamento e escala")
    accent_line(slide)

    fases = [
        ("Fase 1\nMeses 1–3", "Piloto",
         ["Seleção de 3 municípios piloto",
          "Integração com Proteção Civil local",
          "Formação de 50 socorristas e voluntários",
          "Validação de alertas em campo"]),
        ("Fase 2\nMeses 4–9", "Lançamento Regional",
         ["Expansão para 20 municípios",
          "Campanha de sensibilização comunitária",
          "Integração SMS com operadoras nacionais",
          "Relatório de impacto intercalar"]),
        ("Fase 3\nMeses 10–18", "Escala Nacional",
         ["Cobertura nacional (Portugal / Brasil)",
          "API aberta para entidades parceiras",
          "Certificação ISO 22320 (resposta a emergências)",
          "Modelo replicável para outros países"]),
    ]

    x = 0.35
    for fase_titulo, badge, buls in fases:
        add_rect(slide, x, 1.72, 2.95, 5.3, fill_color=LIGHT_GRAY,
                 line_color=RGBColor(0xCC, 0xDD, 0xEE), line_width=Pt(1))
        add_text_box(slide, fase_titulo, x+0.12, 1.82, 2.71, 0.65,
                     font_size=Pt(13), bold=True, color=BLUE)
        add_rect(slide, x+0.12, 2.52, 0.95, 0.3, fill_color=ACCENT)
        add_text_box(slide, badge, x+0.15, 2.54, 0.9, 0.26,
                     font_size=Pt(10), bold=True, color=WHITE, align=PP_ALIGN.CENTER)
        body = "\n".join(f"• {b}" for b in buls)
        add_text_box(slide, body, x+0.12, 2.9, 2.71, 3.9,
                     font_size=Pt(10.5), color=DARK_GRAY, wrap=True)
        x += 3.2

    add_text_box(slide,
        "Investimento total estimado para os 18 meses: €120 000 – €250 000  |  "
        "ROI social estimado: 8× a 15× com base em vidas salvas e danos evitados",
        0.4, 7.0, 9.2, 0.38,
        font_size=Pt(10.5), bold=True, color=DARK_BLUE, align=PP_ALIGN.CENTER)


def slide_equipa(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, LIGHT_GRAY)
    add_header_band(slide, "A Nossa Equipa",
                    "Equipa multidisciplinar internacional com experiência técnica e humanitária")
    accent_line(slide)

    membros = [
        ("Aswathy",    "Líder de Produto",          "Design estratégico\ne experiência do utilizador"),
        ("Francis",    "Arquiteto de Sistemas",      "Infraestrutura cloud\ne segurança"),
        ("Joseph",     "Engenheiro Full-Stack",      "Frontend React\ne integrações API"),
        ("Dinis",      "Dev & Coordenação",          "Desenvolvimento\ne gestão de parceiros"),
        ("Viktoria",   "UX / UI Designer",           "Interface e\nacessibilidade"),
        ("Vaishnavi",  "Análise de Dados",           "Modelos de risco\ne reportes"),
        ("Pooja",      "Gestão de Comunidade",       "Alcance e\nformação"),
        ("Saee",       "Engenheira Backend",         "Firebase, APIs\ne base de dados"),
        ("Jinesh",     "Dev & QA",                   "Testes, CI/CD\ne qualidade"),
    ]

    x, y = 0.3, 1.72
    for i, (nome, cargo, desc) in enumerate(membros):
        col = i % 3
        row = i // 3
        cx = 0.3 + col * 3.22
        cy = 1.72 + row * 1.75
        add_rect(slide, cx, cy, 2.95, 1.6, fill_color=WHITE,
                 line_color=RGBColor(0xCC, 0xDD, 0xEE), line_width=Pt(1))
        add_text_box(slide, nome, cx+0.12, cy+0.1, 2.71, 0.38,
                     font_size=Pt(13), bold=True, color=BLUE)
        add_text_box(slide, cargo, cx+0.12, cy+0.45, 2.71, 0.3,
                     font_size=Pt(11), bold=True, color=DARK_GRAY)
        add_text_box(slide, desc, cx+0.12, cy+0.78, 2.71, 0.72,
                     font_size=Pt(10), color=MID_GRAY, wrap=True)


def slide_cta(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DARK_BLUE)

    add_rect(slide, 0, 0, 10, 7.5, fill_color=DARK_BLUE)
    add_rect(slide, 0, 5.1, 10, 2.4, fill_color=RGBColor(0x00, 0x3A, 0x5C))

    add_text_box(slide, "Junte-se à Missão TSBI", 0.5, 0.55, 9, 0.85,
                 font_size=Pt(36), bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    add_rect(slide, 3.5, 1.48, 3, 0.06, fill_color=ACCENT)

    add_text_box(slide,
        "Cada parceria salva vidas.\nO seu apoio transforma comunidades vulneráveis\nem comunidades resilientes.",
        0.5, 1.65, 9, 1.1,
        font_size=Pt(16), color=RGBColor(0xB0, 0xD4, 0xE8), align=PP_ALIGN.CENTER)

    passos = [
        ("1", "Reunião de apresentação", "Demonstração ao vivo da plataforma\ne discussão de objetivos comuns"),
        ("2", "Acordo de Parceria",       "Definição do nível, contrapartidas\ne plano de integração técnica"),
        ("3", "Lançamento Conjunto",      "Comunicado de imprensa conjunto\ne arranque do piloto em campo"),
    ]
    x = 0.6
    for num, titulo, desc in passos:
        add_rect(slide, x, 2.9, 2.6, 2.0, fill_color=RGBColor(0x00, 0x5A, 0x85))
        add_rect(slide, x+0.12, 3.0, 0.45, 0.45, fill_color=ACCENT)
        add_text_box(slide, num, x+0.12, 3.02, 0.45, 0.42,
                     font_size=Pt(18), bold=True, color=WHITE, align=PP_ALIGN.CENTER)
        add_text_box(slide, titulo, x+0.65, 3.05, 1.85, 0.42,
                     font_size=Pt(12), bold=True, color=WHITE)
        add_text_box(slide, desc, x+0.12, 3.52, 2.36, 1.25,
                     font_size=Pt(10.5), color=RGBColor(0xB0, 0xD4, 0xE8), wrap=True)
        x += 2.9

    add_text_box(slide, "Contacto", 0.5, 5.22, 9, 0.42,
                 font_size=Pt(15), bold=True, color=ACCENT, align=PP_ALIGN.CENTER)
    add_text_box(slide, "thesafetybeaconinitiative@gmail.com",
                 0.5, 5.68, 9, 0.42,
                 font_size=Pt(14), color=WHITE, align=PP_ALIGN.CENTER)
    add_text_box(slide, "tsbi-website.vercel.app  •  Disponível para demonstração presencial ou remota",
                 0.5, 6.18, 9, 0.42,
                 font_size=Pt(12), color=RGBColor(0x77, 0xA8, 0xC4), align=PP_ALIGN.CENTER)
    add_text_box(slide, "The Safety Beacon Initiative  •  Abril 2026",
                 0.5, 6.82, 9, 0.42,
                 font_size=Pt(10), color=RGBColor(0x55, 0x88, 0xA4), align=PP_ALIGN.CENTER)


# ══════════════════════════════════════════════════════════════════════
#  MAIN
# ══════════════════════════════════════════════════════════════════════

def main():
    prs = Presentation()
    prs.slide_width  = Inches(10)
    prs.slide_height = Inches(7.5)

    slide_cover(prs)
    slide_problema(prs)
    slide_solucao(prs)
    slide_impacto(prs)
    slide_tecnologia(prs)
    slide_parceiros(prs)
    slide_roadmap(prs)
    slide_equipa(prs)
    slide_cta(prs)

    out = os.path.join(os.path.dirname(__file__), "..", "TSBI_Pitch_Institucional.pptx")
    prs.save(out)
    print(f"✅  Ficheiro gerado: {os.path.abspath(out)}")

if __name__ == "__main__":
    main()
