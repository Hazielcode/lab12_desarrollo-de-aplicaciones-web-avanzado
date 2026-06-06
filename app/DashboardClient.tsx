"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Trash2, Edit2, ArrowUpRight, Plus, Terminal } from "lucide-react";

export default function DashboardClient({ initialAuthors, stats }: any) {
  const [authors, setAuthors] = useState(initialAuthors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", email: "", bio: "", nationality: "", birthYear: "" });

  const fetchAuthors = async () => {
    const res = await fetch("/api/authors");
    const data = await res.json();
    setAuthors(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingAuthor ? `/api/authors/${editingAuthor.id}` : "/api/authors";
      const method = editingAuthor ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error();
      toast.success(editingAuthor ? "Autor actualizado" : "Autor registrado");
      setIsModalOpen(false);
      fetchAuthors();
    } catch {
      toast.error("Error al guardar autor");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Confirmas la eliminación?")) return;
    try {
      await fetch(`/api/authors/${id}`, { method: "DELETE" });
      toast.success("Autor eliminado");
      fetchAuthors();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const openEditModal = (author: any) => {
    setEditingAuthor(author);
    setFormData({ name: author.name, email: author.email, bio: author.bio || "", nationality: author.nationality || "", birthYear: author.birthYear?.toString() || "" });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* Hero / Stats */}
      <div className="flex flex-col md:flex-row gap-8 justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4">Centro de Comando</h1>
          <p className="text-zinc-400 max-w-lg text-sm md:text-base">Gestiona el registro global de autores y sus obras literarias. Capa de datos de alto rendimiento activa.</p>
        </div>
        <div className="flex gap-8">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1 font-mono">Total Autores</p>
            <p className="text-3xl font-light text-white">{stats.totalAuthors}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1 font-mono">Total Libros</p>
            <p className="text-3xl font-light text-white">{stats.totalBooks}</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-end items-center">
        <button onClick={() => { setEditingAuthor(null); setFormData({ name: "", email: "", bio: "", nationality: "", birthYear: "" }); setIsModalOpen(true); }} className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuevo Autor
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {authors.map((author: any) => (
          <div key={author.id} className="group border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] p-6 rounded-xl transition-colors relative flex flex-col justify-between min-h-[200px]">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-white group-hover:text-cyan-400 transition-colors line-clamp-1">{author.name}</h3>
                <Link href={`/authors/${author.id}`} className="text-zinc-500 hover:text-white transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
              <p className="text-sm text-zinc-400 mb-2 font-mono truncate">{author.email}</p>
              {author.nationality && <p className="text-xs text-zinc-500 uppercase tracking-wider">{author.nationality}</p>}
            </div>
            
            <div className="flex justify-between items-end mt-6 pt-4 border-t border-white/5">
              <span className="text-xs text-zinc-500 font-mono">Libros: <span className="text-white">{author._count?.books || 0}</span></span>
              <div className="flex gap-3">
                <button onClick={() => openEditModal(author)} className="text-zinc-500 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(author.id)} className="text-zinc-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {authors.length === 0 && (
          <div className="col-span-full py-20 text-center border border-white/5 border-dashed rounded-xl">
            <p className="text-zinc-500 font-mono">No se detectaron autores en el registro.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-black border border-white/10 rounded-xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-medium text-white mb-6 border-b border-white/5 pb-4">{editingAuthor ? "Actualizar Identidad de Autor" : "Inicializar Nuevo Autor"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Nombre</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Correo</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Nacionalidad</label>
                  <input type="text" value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Año de Nacimiento</label>
                  <input type="number" value={formData.birthYear} onChange={e => setFormData({...formData, birthYear: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Biografía</label>
                <textarea rows={3} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30 transition-colors resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors">Abortar</button>
                <button type="submit" className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-md text-xs font-medium transition-colors">{editingAuthor ? "Guardar" : "Ejecutar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
