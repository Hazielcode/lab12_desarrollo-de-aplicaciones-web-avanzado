"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Edit2, ChevronLeft, Loader2, FileText, Plus } from "lucide-react";
import Link from "next/link";

export default function AuthorDetailClient({ initialAuthor }: any) {
  const [author, setAuthor] = useState(initialAuthor);
  const [stats, setStats] = useState<any>(null);
  const [isEditAuthorOpen, setIsEditAuthorOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);

  const [authorForm, setAuthorForm] = useState({ name: author.name, email: author.email, bio: author.bio || "", nationality: author.nationality || "", birthYear: author.birthYear?.toString() || "" });
  const [bookForm, setBookForm] = useState({ title: "", description: "", isbn: "", publishedYear: "", genre: "", pages: "" });

  const fetchStatsAndAuthor = async () => {
    try {
      const [statsRes, authorRes] = await Promise.all([fetch(`/api/authors/${author.id}/stats`), fetch(`/api/authors/${author.id}`)]);
      setStats(await statsRes.json()); setAuthor(await authorRes.json());
    } catch { toast.error("Error en sincronización de datos"); }
  };

  useEffect(() => { fetchStatsAndAuthor(); }, []);

  const handleEditAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/authors/${author.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(authorForm) });
      if (!res.ok) throw new Error();
      toast.success("Identidad actualizada"); setIsEditAuthorOpen(false); fetchStatsAndAuthor();
    } catch { toast.error("Error al actualizar"); }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/books`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...bookForm, authorId: author.id }) });
      if (!res.ok) throw new Error();
      toast.success("Registro añadido"); setIsAddBookOpen(false); setBookForm({ title: "", description: "", isbn: "", publishedYear: "", genre: "", pages: "" }); fetchStatsAndAuthor();
    } catch { toast.error("Error al añadir registro"); }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <Link href="/" className="inline-flex items-center text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Volver
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="border border-white/10 bg-black p-8 rounded-xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tighter text-white mb-1">{author.name}</h1>
                <p className="text-zinc-500 font-mono text-xs">{author.email}</p>
              </div>
              <button onClick={() => setIsEditAuthorOpen(true)} className="text-zinc-500 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4 text-sm text-zinc-400 font-mono">
              {author.nationality && <div className="flex justify-between"><span>Origen</span> <span className="text-white">{author.nationality}</span></div>}
              {author.birthYear && <div className="flex justify-between"><span>Nacimiento</span> <span className="text-white">{author.birthYear}</span></div>}
            </div>
            {author.bio && <div className="mt-8 pt-8 border-t border-white/5"><p className="text-zinc-300 text-sm leading-relaxed">{author.bio}</p></div>}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="border border-white/10 bg-black p-8 rounded-xl">
            <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6">Métricas y Telemetría</h3>
            {!stats ? <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-zinc-500" /></div> : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div><p className="text-xs text-zinc-500 font-mono mb-1">Total</p><p className="text-2xl text-white font-light">{stats.totalBooks}</p></div>
                <div><p className="text-xs text-zinc-500 font-mono mb-1">Prom. Páginas</p><p className="text-2xl text-white font-light">{stats.averagePages}</p></div>
                <div><p className="text-xs text-zinc-500 font-mono mb-1">Géneros</p><p className="text-2xl text-white font-light">{stats.genres?.length || 0}</p></div>
                {stats.firstBook && <div className="col-span-2 sm:col-span-1 pt-4 border-t border-white/5"><p className="text-xs text-zinc-500 font-mono mb-1">Primer Registro</p><p className="text-sm text-white line-clamp-1">{stats.firstBook.title}</p><p className="text-xs text-cyan-400/70">{stats.firstBook.year}</p></div>}
                {stats.latestBook && <div className="col-span-2 sm:col-span-1 pt-4 border-t border-white/5"><p className="text-xs text-zinc-500 font-mono mb-1">Último Registro</p><p className="text-sm text-white line-clamp-1">{stats.latestBook.title}</p><p className="text-xs text-cyan-400/70">{stats.latestBook.year}</p></div>}
                {stats.longestBook && <div className="col-span-2 sm:col-span-1 pt-4 border-t border-white/5"><p className="text-xs text-zinc-500 font-mono mb-1">Máx Páginas</p><p className="text-sm text-white line-clamp-1">{stats.longestBook.title}</p><p className="text-xs text-cyan-400/70">{stats.longestBook.pages}</p></div>}
              </div>
            )}
          </div>

          <div className="border border-white/10 bg-black rounded-xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Registros Vinculados</h3>
              <button onClick={() => setIsAddBookOpen(true)} className="text-xs font-medium bg-white text-black hover:bg-zinc-200 px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors"><Plus className="w-3 h-3" /> Añadir</button>
            </div>
            <div className="divide-y divide-white/5">
              {author.books.map((book: any) => (
                <div key={book.id} className="p-6 hover:bg-white/[0.02] transition-colors">
                  <div className="flex justify-between items-start mb-2"><h4 className="text-base font-medium text-white">{book.title}</h4>{book.publishedYear && <span className="font-mono text-xs text-zinc-500">{book.publishedYear}</span>}</div>
                  {book.description && <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{book.description}</p>}
                  <div className="flex gap-4 text-xs font-mono text-zinc-500">{book.genre && <span>{book.genre}</span>}{book.pages && <span>{book.pages} pg</span>}{book.isbn && <span>ISBN: {book.isbn}</span>}</div>
                </div>
              ))}
              {author.books.length === 0 && <div className="p-12 text-center text-zinc-500 font-mono text-sm">No hay registros asociados.</div>}
            </div>
          </div>
        </div>
      </div>

      {isEditAuthorOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4"><div className="bg-black border border-white/10 rounded-xl w-full max-w-md p-6 shadow-2xl"><h3 className="text-lg font-medium text-white mb-6 border-b border-white/5 pb-4">Modificar Identidad</h3><form onSubmit={handleEditAuthor} className="space-y-4"><div><label className="block text-xs font-mono text-zinc-500 mb-2 uppercase">Nombre</label><input required type="text" value={authorForm.name} onChange={e => setAuthorForm({...authorForm, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30" /></div><div><label className="block text-xs font-mono text-zinc-500 mb-2 uppercase">Correo</label><input required type="email" value={authorForm.email} onChange={e => setAuthorForm({...authorForm, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30" /></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-xs font-mono text-zinc-500 mb-2 uppercase">Origen</label><input type="text" value={authorForm.nationality} onChange={e => setAuthorForm({...authorForm, nationality: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30" /></div><div><label className="block text-xs font-mono text-zinc-500 mb-2 uppercase">Nacimiento</label><input type="number" value={authorForm.birthYear} onChange={e => setAuthorForm({...authorForm, birthYear: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30" /></div></div><div><label className="block text-xs font-mono text-zinc-500 mb-2 uppercase">Biografía</label><textarea rows={3} value={authorForm.bio} onChange={e => setAuthorForm({...authorForm, bio: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30 resize-none" /></div><div className="flex justify-end gap-3 pt-4"><button type="button" onClick={()=>setIsEditAuthorOpen(false)} className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white">Abortar</button><button type="submit" className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-md text-xs font-medium">Ejecutar</button></div></form></div></div>
      )}

      {isAddBookOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4"><div className="bg-black border border-white/10 rounded-xl w-full max-w-md p-6 shadow-2xl"><h3 className="text-lg font-medium text-white mb-6 border-b border-white/5 pb-4">Añadir Registro</h3><form onSubmit={handleAddBook} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2"><div><label className="block text-xs font-mono text-zinc-500 mb-2 uppercase">Título *</label><input required type="text" value={bookForm.title} onChange={e => setBookForm({...bookForm, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30" /></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-xs font-mono text-zinc-500 mb-2 uppercase">Género</label><input type="text" value={bookForm.genre} onChange={e => setBookForm({...bookForm, genre: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30" /></div><div><label className="block text-xs font-mono text-zinc-500 mb-2 uppercase">Año</label><input type="number" value={bookForm.publishedYear} onChange={e => setBookForm({...bookForm, publishedYear: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30" /></div><div><label className="block text-xs font-mono text-zinc-500 mb-2 uppercase">Páginas</label><input type="number" value={bookForm.pages} onChange={e => setBookForm({...bookForm, pages: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30" /></div><div><label className="block text-xs font-mono text-zinc-500 mb-2 uppercase">ISBN</label><input type="text" value={bookForm.isbn} onChange={e => setBookForm({...bookForm, isbn: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30" /></div></div><div><label className="block text-xs font-mono text-zinc-500 mb-2 uppercase">Descripción</label><textarea rows={3} value={bookForm.description} onChange={e => setBookForm({...bookForm, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30 resize-none" /></div><div className="flex justify-end gap-3 pt-4"><button type="button" onClick={()=>setIsAddBookOpen(false)} className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white">Abortar</button><button type="submit" className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-md text-xs font-medium">Ejecutar</button></div></form></div></div>
      )}
    </div>
  );
}
