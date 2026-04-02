'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { SiteContent, HeroSlideContent, StatContent, ShowroomContent } from '@/config/content-schema'
import { SITE_DEFAULTS } from '@/config/content-schema'

// ─── Types ─────────────────────────────────────────────────────────────────
type Tab = 'hero' | 'announcement' | 'contact' | 'showrooms' | 'stats' | 'sections' | 'seo'

// ─── Helpers ────────────────────────────────────────────────────────────────
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#888] mb-1">
      {children}
    </label>
  )
}

function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  className?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full h-9 px-3 border border-[rgba(0,0,0,0.12)] bg-white text-sm text-[#0c0c0c] outline-none focus:border-[#0c0c0c] transition-colors ${className}`}
    />
  )
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 border border-[rgba(0,0,0,0.12)] bg-white text-sm text-[#0c0c0c] outline-none focus:border-[#0c0c0c] transition-colors resize-none"
    />
  )
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-[#0c0c0c]' : 'bg-[#ddd]'}`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </div>
      <span className="text-sm text-[#0c0c0c]">{label}</span>
    </label>
  )
}

function BilingualField({
  label,
  en,
  ar,
  onEnChange,
  onArChange,
  multiline = false,
}: {
  label: string
  en: string
  ar: string
  onEnChange: (v: string) => void
  onArChange: (v: string) => void
  multiline?: boolean
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-[10px] text-[#aaa] mb-1">English</p>
          {multiline ? (
            <Textarea value={en} onChange={onEnChange} placeholder="EN" rows={2} />
          ) : (
            <Input value={en} onChange={onEnChange} placeholder="EN" />
          )}
        </div>
        <div>
          <p className="text-[10px] text-[#aaa] mb-1">Arabic</p>
          {multiline ? (
            <Textarea value={ar} onChange={onArChange} placeholder="AR" rows={2} />
          ) : (
            <Input value={ar} onChange={onArChange} placeholder="AR" />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Image Uploader ──────────────────────────────────────────────────────────
function ImageUploader({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState(value)

  async function handleFile(file: File) {
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      if (res.ok) {
        const { url } = await res.json()
        onChange(url)
        setUrlInput(url)
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {/* Preview */}
      {value && (
        <div className="relative w-full h-32 bg-[#f0f0f0] overflow-hidden">
          <Image src={value} alt="preview" fill className="object-cover" unoptimized />
        </div>
      )}
      {/* URL input */}
      <Input
        value={urlInput}
        onChange={(v) => { setUrlInput(v); onChange(v) }}
        placeholder="https:// or /images/..."
      />
      {/* Upload button */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="text-xs px-3 py-1.5 border border-[rgba(0,0,0,0.15)] text-[#484848] hover:bg-[#f0f0f0] transition-colors disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : '↑ Upload image'}
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  )
}

// ─── Hero Tab ────────────────────────────────────────────────────────────────
function HeroTab({
  slides,
  onChange,
}: {
  slides: HeroSlideContent[]
  onChange: (slides: HeroSlideContent[]) => void
}) {
  const [active, setActive] = useState(0)
  const slide = slides[active]

  function updateSlide(patch: Partial<HeroSlideContent>) {
    const next = slides.map((s, i) => (i === active ? { ...s, ...patch } : s))
    onChange(next)
  }

  function addSlide() {
    onChange([...slides, deepClone(SITE_DEFAULTS.heroSlides[0])])
    setActive(slides.length)
  }

  function removeSlide(i: number) {
    if (slides.length <= 1) return
    const next = slides.filter((_, idx) => idx !== i)
    onChange(next)
    setActive(Math.min(active, next.length - 1))
  }

  return (
    <div className="space-y-6">
      {/* Slide tabs */}
      <div className="flex gap-2 flex-wrap">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`px-4 py-1.5 text-xs font-medium border transition-colors ${
              active === i
                ? 'bg-[#0c0c0c] text-white border-[#0c0c0c]'
                : 'bg-white text-[#484848] border-[rgba(0,0,0,0.12)] hover:border-[#0c0c0c]'
            }`}
          >
            Slide {i + 1}
          </button>
        ))}
        <button
          onClick={addSlide}
          className="px-4 py-1.5 text-xs font-medium border border-dashed border-[rgba(0,0,0,0.2)] text-[#888] hover:border-[#0c0c0c] hover:text-[#0c0c0c] transition-colors"
        >
          + Add slide
        </button>
      </div>

      {/* Slide editor */}
      <div className="space-y-5">
        <div>
          <Label>Hero Image (desktop)</Label>
          <ImageUploader value={slide.image} onChange={(url) => updateSlide({ image: url })} />
        </div>
        <div>
          <Label>Mobile Image</Label>
          <ImageUploader value={slide.mobileImage} onChange={(url) => updateSlide({ mobileImage: url })} />
        </div>
        <BilingualField
          label="Collection Label (small gold text)"
          en={slide.collection.en}
          ar={slide.collection.ar}
          onEnChange={(v) => updateSlide({ collection: { ...slide.collection, en: v } })}
          onArChange={(v) => updateSlide({ collection: { ...slide.collection, ar: v } })}
        />
        <BilingualField
          label="Headline"
          en={slide.headline.en}
          ar={slide.headline.ar}
          onEnChange={(v) => updateSlide({ headline: { ...slide.headline, en: v } })}
          onArChange={(v) => updateSlide({ headline: { ...slide.headline, ar: v } })}
          multiline
        />
        <BilingualField
          label="Tagline"
          en={slide.tagline.en}
          ar={slide.tagline.ar}
          onEnChange={(v) => updateSlide({ tagline: { ...slide.tagline, en: v } })}
          onArChange={(v) => updateSlide({ tagline: { ...slide.tagline, ar: v } })}
          multiline
        />
        <BilingualField
          label="CTA Button Text"
          en={slide.cta.en}
          ar={slide.cta.ar}
          onEnChange={(v) => updateSlide({ cta: { ...slide.cta, en: v } })}
          onArChange={(v) => updateSlide({ cta: { ...slide.cta, ar: v } })}
        />
        <div>
          <Label>CTA Link (href)</Label>
          <Input value={slide.href} onChange={(v) => updateSlide({ href: v })} placeholder="/shop?category=..." />
        </div>
        {slides.length > 1 && (
          <button
            onClick={() => removeSlide(active)}
            className="text-xs text-red-500 hover:text-red-700 underline"
          >
            Remove this slide
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('hero')
  const [content, setContent] = useState<SiteContent>(deepClone(SITE_DEFAULTS))
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')

  // Load current content from Edge Config on mount
  useEffect(() => {
    fetch('/api/admin/content')
      .then((r) => r.json())
      .then((data) => setContent(data))
      .catch(() => {/* use defaults */})
  }, [])

  async function handleSave() {
    setSaving(true)
    setSaveStatus('idle')
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })
      setSaveStatus(res.ok ? 'saved' : 'error')
    } catch {
      setSaveStatus('error')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'hero', label: 'Hero Slides' },
    { id: 'announcement', label: 'Announcement Bar' },
    { id: 'contact', label: 'Contact Info' },
    { id: 'showrooms', label: 'Showrooms' },
    { id: 'stats', label: 'Stats' },
    { id: 'sections', label: 'Sections' },
    { id: 'seo', label: 'SEO' },
  ]

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      {/* Top bar */}
      <header className="bg-white border-b border-[rgba(0,0,0,0.08)] px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Image src="/images/majestic-logo-black.png" alt="Majestic" width={110} height={32} className="object-contain" />
          <span className="text-xs text-[#aaa] border-l border-[rgba(0,0,0,0.1)] pl-4 uppercase tracking-widest">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === 'saved' && (
            <span className="text-xs text-green-600 font-medium">✓ Saved — changes are live</span>
          )}
          {saveStatus === 'error' && (
            <span className="text-xs text-red-600 font-medium">Save failed — try again</span>
          )}
          <a
            href="https://majestic-next.vercel.app/en"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 border border-[rgba(0,0,0,0.12)] text-[#484848] hover:bg-[#f0f0f0] transition-colors"
          >
            View site ↗
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-xs px-4 py-1.5 bg-[#0c0c0c] text-white hover:bg-[#2c2c2c] disabled:opacity-50 transition-colors font-medium"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <button
            onClick={handleLogout}
            className="text-xs text-[#aaa] hover:text-[#0c0c0c] transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-49px)]">
        {/* Sidebar */}
        <aside className="w-48 bg-white border-r border-[rgba(0,0,0,0.08)] py-4 shrink-0">
          <nav className="space-y-0.5 px-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  tab === t.id
                    ? 'bg-[#f0f0f0] text-[#0c0c0c] font-medium'
                    : 'text-[#484848] hover:bg-[#f7f7f5]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content area */}
        <main className="flex-1 p-8 max-w-3xl">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#888] mb-6">
            {tabs.find((t) => t.id === tab)?.label}
          </h2>

          {/* ── Hero Slides ── */}
          {tab === 'hero' && (
            <HeroTab
              slides={content.heroSlides}
              onChange={(slides) => setContent({ ...content, heroSlides: slides })}
            />
          )}

          {/* ── Announcement Bar ── */}
          {tab === 'announcement' && (
            <div className="space-y-5">
              <Toggle
                checked={content.announcement.enabled}
                onChange={(v) => setContent({ ...content, announcement: { ...content.announcement, enabled: v } })}
                label="Show announcement bar at top of site"
              />
              <BilingualField
                label="Message"
                en={content.announcement.message.en}
                ar={content.announcement.message.ar}
                onEnChange={(v) => setContent({ ...content, announcement: { ...content.announcement, message: { ...content.announcement.message, en: v } } })}
                onArChange={(v) => setContent({ ...content, announcement: { ...content.announcement, message: { ...content.announcement.message, ar: v } } })}
              />
              <div>
                <Label>Link (optional)</Label>
                <Input
                  value={content.announcement.link}
                  onChange={(v) => setContent({ ...content, announcement: { ...content.announcement, link: v } })}
                  placeholder="/shop or https://..."
                />
              </div>
              <div>
                <Label>Background colour</Label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={content.announcement.bgColor}
                    onChange={(e) => setContent({ ...content, announcement: { ...content.announcement, bgColor: e.target.value } })}
                    className="w-9 h-9 border border-[rgba(0,0,0,0.12)] cursor-pointer"
                  />
                  <Input
                    value={content.announcement.bgColor}
                    onChange={(v) => setContent({ ...content, announcement: { ...content.announcement, bgColor: v } })}
                    placeholder="#2C2C2C"
                    className="max-w-[140px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Contact Info ── */}
          {tab === 'contact' && (
            <div className="space-y-5">
              <div>
                <Label>Phone (display)</Label>
                <Input value={content.contact.phone} onChange={(v) => setContent({ ...content, contact: { ...content.contact, phone: v } })} placeholder="+966 9200 12019" />
              </div>
              <div>
                <Label>Phone (tel: link)</Label>
                <Input value={content.contact.phoneHref} onChange={(v) => setContent({ ...content, contact: { ...content.contact, phoneHref: v } })} placeholder="tel:+96692001219" />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={content.contact.email} onChange={(v) => setContent({ ...content, contact: { ...content.contact, email: v } })} placeholder="info@majestic.com.sa" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Address (English)</Label>
                  <Textarea value={content.contact.addressEn} onChange={(v) => setContent({ ...content, contact: { ...content.contact, addressEn: v } })} rows={2} />
                </div>
                <div>
                  <Label>Address (Arabic)</Label>
                  <Textarea value={content.contact.addressAr} onChange={(v) => setContent({ ...content, contact: { ...content.contact, addressAr: v } })} rows={2} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Hours (English)</Label>
                  <Input value={content.contact.hoursEn} onChange={(v) => setContent({ ...content, contact: { ...content.contact, hoursEn: v } })} />
                </div>
                <div>
                  <Label>Hours (Arabic)</Label>
                  <Input value={content.contact.hoursAr} onChange={(v) => setContent({ ...content, contact: { ...content.contact, hoursAr: v } })} />
                </div>
              </div>
            </div>
          )}

          {/* ── Showrooms ── */}
          {tab === 'showrooms' && (
            <div className="space-y-8">
              {content.showrooms.map((s: ShowroomContent, i: number) => (
                <div key={s.id} className="border border-[rgba(0,0,0,0.08)] bg-white p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">{s.name.en}</h3>
                    <Toggle
                      checked={s.comingSoon}
                      onChange={(v) => {
                        const next = [...content.showrooms]
                        next[i] = { ...s, comingSoon: v }
                        setContent({ ...content, showrooms: next })
                      }}
                      label="Coming soon"
                    />
                  </div>
                  <BilingualField
                    label="Name"
                    en={s.name.en}
                    ar={s.name.ar}
                    onEnChange={(v) => { const next = [...content.showrooms]; next[i] = { ...s, name: { ...s.name, en: v } }; setContent({ ...content, showrooms: next }) }}
                    onArChange={(v) => { const next = [...content.showrooms]; next[i] = { ...s, name: { ...s.name, ar: v } }; setContent({ ...content, showrooms: next }) }}
                  />
                  <BilingualField
                    label="Address"
                    en={s.address.en}
                    ar={s.address.ar}
                    onEnChange={(v) => { const next = [...content.showrooms]; next[i] = { ...s, address: { ...s.address, en: v } }; setContent({ ...content, showrooms: next }) }}
                    onArChange={(v) => { const next = [...content.showrooms]; next[i] = { ...s, address: { ...s.address, ar: v } }; setContent({ ...content, showrooms: next }) }}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Phone</Label>
                      <Input value={s.phone} onChange={(v) => { const next = [...content.showrooms]; next[i] = { ...s, phone: v }; setContent({ ...content, showrooms: next }) }} />
                    </div>
                    <div>
                      <Label>Google Maps URL</Label>
                      <Input value={s.mapsUrl} onChange={(v) => { const next = [...content.showrooms]; next[i] = { ...s, mapsUrl: v }; setContent({ ...content, showrooms: next }) }} placeholder="https://maps.google.com/..." />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Stats ── */}
          {tab === 'stats' && (
            <div className="space-y-4">
              {content.stats.map((s: StatContent, i: number) => (
                <div key={i} className="border border-[rgba(0,0,0,0.08)] bg-white p-4 space-y-3">
                  <Toggle
                    checked={s.visible}
                    onChange={(v) => { const next = [...content.stats]; next[i] = { ...s, visible: v }; setContent({ ...content, stats: next }) }}
                    label="Show this stat"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Number</Label>
                      <Input value={String(s.value)} onChange={(v) => { const next = [...content.stats]; next[i] = { ...s, value: Number(v) || 0 }; setContent({ ...content, stats: next }) }} type="number" />
                    </div>
                    <div>
                      <Label>Suffix</Label>
                      <Input value={s.suffix} onChange={(v) => { const next = [...content.stats]; next[i] = { ...s, suffix: v }; setContent({ ...content, stats: next }) }} placeholder="+" />
                    </div>
                  </div>
                  <BilingualField
                    label="Label"
                    en={s.label.en}
                    ar={s.label.ar}
                    onEnChange={(v) => { const next = [...content.stats]; next[i] = { ...s, label: { ...s.label, en: v } }; setContent({ ...content, stats: next }) }}
                    onArChange={(v) => { const next = [...content.stats]; next[i] = { ...s, label: { ...s.label, ar: v } }; setContent({ ...content, stats: next }) }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ── Sections ── */}
          {tab === 'sections' && (
            <div className="space-y-4">
              <p className="text-sm text-[#888]">Toggle homepage sections on or off. Changes are instant.</p>
              {(Object.keys(content.sections) as Array<keyof typeof content.sections>).map((key) => (
                <Toggle
                  key={key}
                  checked={content.sections[key]}
                  onChange={(v) => setContent({ ...content, sections: { ...content.sections, [key]: v } })}
                  label={{
                    spaceTypology: 'Space Typology (Every Space Has a Standard)',
                    collections: 'Collections (Directorial Suite, Collaborative Floor…)',
                    craftsmanshipBand: 'Craftsmanship Band (scrolling detail photos)',
                    projectScale: 'Project Scale (case studies with stats)',
                    materialSelector: 'Material Selector (finish swatches)',
                    insightEditorial: 'Insight Editorial (blog articles preview)',
                    consultationCta: 'Consultation CTA (bottom call-to-action)',
                  }[key]}
                />
              ))}
              <div className="pt-4 border-t border-[rgba(0,0,0,0.08)]">
                <Label>Global font scale</Label>
                <div className="flex gap-2 mt-1">
                  {(['sm', 'md', 'lg'] as const).map((scale) => (
                    <button
                      key={scale}
                      onClick={() => setContent({ ...content, fontScale: scale })}
                      className={`px-4 py-1.5 text-sm border transition-colors ${
                        content.fontScale === scale
                          ? 'bg-[#0c0c0c] text-white border-[#0c0c0c]'
                          : 'bg-white text-[#484848] border-[rgba(0,0,0,0.12)]'
                      }`}
                    >
                      {scale === 'sm' ? 'Small' : scale === 'md' ? 'Normal' : 'Large'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── SEO ── */}
          {tab === 'seo' && (
            <div className="space-y-2">
              <p className="text-sm text-[#888] mb-5">
                These are the default meta tags used across the site. Individual pages may override them.
              </p>
              <p className="text-xs text-[#aaa] bg-[#f0f0f0] px-3 py-2 border border-[rgba(0,0,0,0.08)]">
                SEO per-page controls coming in the next update. For now, edit <code className="text-xs bg-white px-1">src/config/site.ts</code> directly.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
