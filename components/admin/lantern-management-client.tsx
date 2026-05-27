'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Edit2, Trash2, Upload, X, Loader2,
  ImageIcon, Save, AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Lantern, LanternFormData } from '@/types'

interface Props { initialLanterns: Lantern[] }

const emptyForm: LanternFormData = { name: '', team_name: '', description: '', image_url: '' }

export function LanternManagementClient({ initialLanterns }: Props) {
  const [lanterns, setLanterns] = useState<Lantern[]>(initialLanterns)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<LanternFormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const openCreate = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (l: Lantern) => {
    setForm({ name: l.name, team_name: l.team_name, description: l.description || '', image_url: l.image_url || '' })
    setEditingId(l.id)
    setShowForm(true)
  }

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image file'); return }
    if (file.size > 10 * 1024 * 1024) { toast.error('Image must be under 10 MB'); return }

    setUploading(true)
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target?.result as string
      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: base64 }),
        })
        const data = await res.json()
        if (data.success) {
          setForm((f) => ({ ...f, image_url: data.url }))
          toast.success('Image uploaded! ✅')
        } else {
          toast.error(data.error || 'Upload failed')
        }
      } catch {
        toast.error('Upload failed')
      } finally {
        setUploading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.team_name.trim()) {
      toast.error('Name and team name are required')
      return
    }
    setSaving(true)
    try {
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId ? { id: editingId, ...form } : form

      const res = await fetch('/api/admin/lanterns', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.success) {
        if (editingId) {
          setLanterns((prev) => prev.map((l) => l.id === editingId ? data.data : l))
          toast.success('Lantern updated! 🏮')
        } else {
          setLanterns((prev) => [...prev, data.data])
          toast.success('Lantern added! 🏮')
        }
        setShowForm(false)
        setEditingId(null)
        setForm(emptyForm)
      } else {
        toast.error(data.error || 'Save failed')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/admin/lanterns', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (data.success) {
        setLanterns((prev) => prev.filter((l) => l.id !== id))
        toast.success('Lantern deleted')
      } else {
        toast.error(data.error || 'Delete failed')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setDeleteConfirm(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {lanterns.length} / 12 lanterns registered
        </p>
        <button
          onClick={openCreate}
          disabled={lanterns.length >= 12}
          className="btn-gold px-5 py-2.5 rounded-xl font-semibold text-black text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" /> Add Lantern
        </button>
      </div>

      {/* Lantern list */}
      <div className="grid gap-4">
        {lanterns.map((lantern, i) => (
          <motion.div
            key={lantern.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass rounded-2xl p-4 border border-border flex items-center gap-4"
          >
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary flex-shrink-0 flex items-center justify-center">
              {lantern.image_url ? (
                <Image src={lantern.image_url} alt={lantern.name} width={64} height={64} className="object-cover w-full h-full" />
              ) : (
                <span className="text-2xl">🏮</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{lantern.name}</p>
              <p className="text-muted-foreground text-sm truncate">{lantern.team_name}</p>
              <p className="text-gold-500 text-sm font-medium">{lantern.vote_count} votes</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => openEdit(lantern)}
                className="p-2 rounded-lg text-muted-foreground hover:text-gold-400 hover:bg-gold-500/10 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              {deleteConfirm === lantern.id ? (
                <div className="flex items-center gap-1">
                  <button onClick={() => handleDelete(lantern.id)} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold">
                    Confirm
                  </button>
                  <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 bg-secondary text-muted-foreground rounded-lg text-xs">
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(lantern.id)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {lanterns.length === 0 && (
          <div className="text-center py-16 text-muted-foreground glass rounded-2xl border border-border">
            <span className="text-5xl block mb-3">🏮</span>
            <p className="font-medium">No lanterns yet</p>
            <p className="text-sm mt-1">Click "Add Lantern" to get started</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative glass-strong rounded-3xl p-6 border border-gold-500/20 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl gold-text">
                  {editingId ? 'Edit Lantern' : 'Add Lantern'}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Image upload */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Lantern Image</label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className={cn(
                      'relative w-full aspect-video rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors',
                      'border-border hover:border-gold-500/40 bg-secondary/50'
                    )}
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
                        <p className="text-sm">Uploading...</p>
                      </div>
                    ) : form.image_url ? (
                      <Image src={form.image_url} alt="Preview" fill className="object-cover rounded-xl" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <ImageIcon className="h-8 w-8" />
                        <p className="text-sm">Click to upload image</p>
                        <p className="text-xs">JPG, PNG, WebP up to 10MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  />
                  {form.image_url && (
                    <button onClick={() => setForm((f) => ({ ...f, image_url: '' }))} className="mt-1 text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                      <X className="h-3 w-3" /> Remove image
                    </button>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Lantern Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Golden Lotus"
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold-500/50 transition-colors"
                  />
                </div>

                {/* Team name */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Team Name *</label>
                  <input
                    type="text"
                    value={form.team_name}
                    onChange={(e) => setForm((f) => ({ ...f, team_name: e.target.value }))}
                    placeholder="e.g. Grade 11A"
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold-500/50 transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Describe the lantern design and inspiration..."
                    rows={3}
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold-500/50 transition-colors resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl bg-secondary text-muted-foreground font-medium text-sm hover:text-foreground transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || uploading}
                    className="flex-1 btn-gold py-2.5 rounded-xl font-semibold text-black text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Lantern</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
