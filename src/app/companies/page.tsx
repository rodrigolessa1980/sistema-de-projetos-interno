"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { useProjectStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { motion } from "@/lib/motion";
import {
  Building2, MoreVertical, Pencil, Trash2, FolderKanban, Plus, Hash,
} from "lucide-react";
import type { Company } from "@/types";

const companyColors = [
  "#6366f1", "#22c55e", "#f59e0b", "#ef4444",
  "#8b5cf6", "#06b6d4", "#f97316", "#ec4899",
];

const companySchema = z.object({
  name: z.string().optional(),
  shortName: z.string().max(10, "Máximo 10 caracteres").optional(),
  color: z.string().optional(),
  cnpj: z.string().optional(),
});

type CompanyForm = z.infer<typeof companySchema>;

function CompanyFormDialog({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  title,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultValues: CompanyForm;
  onSubmit: (data: CompanyForm) => void;
  title: string;
}) {
  const form = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
    defaultValues,
  });

  // Sync form when dialog reopens with new defaultValues
  const watchedColor = form.watch("color");
  const watchedShort = form.watch("shortName");

  function handleSubmit(data: CompanyForm) {
    onSubmit(data);
    form.reset(defaultValues);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) form.reset(defaultValues); }}>
      <DialogContent className="bg-zinc-900 border-zinc-700/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

            {/* Preview do badge */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/60 border border-zinc-700/50">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ background: watchedColor || companyColors[0] }}
              >
                {watchedShort?.slice(0, 2).toUpperCase() || "??"}
              </div>
              <div>
                <p className="text-xs text-zinc-400">Preview do badge</p>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border"
                  style={{
                    background: `${watchedColor || companyColors[0]}18`,
                    color: watchedColor || companyColors[0],
                    borderColor: `${watchedColor || companyColors[0]}35`,
                  }}
                >
                  <Building2 className="w-3 h-3" />
                  {watchedShort || "Sigla"}
                </span>
              </div>
            </div>

            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <Label className="text-zinc-300 text-sm">Razão Social / Nome</Label>
                <FormControl>
                  <Input {...field} placeholder="Ex: Tech Solutions Ltda." className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="shortName" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm flex items-center gap-1">
                    <Hash className="w-3 h-3 text-zinc-500" /> Sigla
                  </Label>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Tech" maxLength={10} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="cnpj" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">CNPJ</Label>
                  <FormControl>
                    <Input {...field} placeholder="00.000.000/0001-00" className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="color" render={({ field }) => (
              <FormItem>
                <Label className="text-zinc-300 text-sm">Cor de identificação</Label>
                <div className="flex gap-2 flex-wrap">
                  {companyColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => field.onChange(c)}
                      className={`w-7 h-7 rounded-lg transition-all ${field.value === c ? "ring-2 ring-white scale-110" : "opacity-70 hover:opacity-100"}`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </FormItem>
            )} />

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-zinc-400">
                Cancelar
              </Button>
              <Button type="submit" className="bg-violet-600 hover:bg-violet-700">
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function CompaniesPage() {
  const { companies, projects, createCompany, updateCompany, deleteCompany } = useProjectStore();
  const { isAdmin } = useAuth();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const createDefaults: CompanyForm = { name: "", shortName: "", color: companyColors[0], cnpj: "" };

  function handleCreate(data: CompanyForm) {
    createCompany({
      ...data,
      name: data.name?.trim() || `Empresa ${new Date().toLocaleString("pt-BR")}`,
      shortName: data.shortName?.trim() || "EMP",
      color: data.color || companyColors[0],
      cnpj: data.cnpj || undefined,
    });
    toast.success("Empresa cadastrada com sucesso!");
    setIsCreateOpen(false);
  }

  function handleEdit(data: CompanyForm) {
    if (!editingCompany) return;
    updateCompany(editingCompany.id, {
      ...data,
      name: data.name?.trim() || editingCompany.name,
      shortName: data.shortName?.trim() || editingCompany.shortName,
      color: data.color || editingCompany.color,
      cnpj: data.cnpj || undefined,
    });
    toast.success("Empresa atualizada!");
    setEditingCompany(null);
  }

  function handleDelete(company: Company) {
    const linked = projects.filter((p) => p.companyId === company.id).length;
    if (linked > 0) {
      toast.error(`Não é possível excluir: ${linked} projeto${linked > 1 ? "s" : ""} vinculado${linked > 1 ? "s" : ""}.`);
      return;
    }
    deleteCompany(company.id);
    toast.success("Empresa removida.");
  }

  return (
    <>
      <PageHeader
        title="Empresas do Grupo"
        description={`${companies.length} empresa${companies.length !== 1 ? "s" : ""} cadastrada${companies.length !== 1 ? "s" : ""}`}
        actions={isAdmin ? [{ label: "Nova Empresa", onClick: () => setIsCreateOpen(true) }] : undefined}
      />

      <div className="p-6 w-full">
        {companies.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Nenhuma empresa cadastrada"
            description="Cadastre as empresas do grupo para vinculá-las aos projetos."
            action={isAdmin ? { label: "Cadastrar Empresa", onClick: () => setIsCreateOpen(true) } : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {companies.map((company, i) => {
              const linkedProjects = projects.filter((p) => p.companyId === company.id);
              return (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5 hover:border-zinc-700/50 transition-all hover:shadow-lg hover:shadow-black/20"
                >
                  <div className="flex items-start justify-between mb-4">
                    {/* Avatar + nome */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ background: company.color }}
                      >
                        {company.shortName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white leading-snug">
                          {company.name}
                        </h3>
                        <span
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border mt-0.5"
                          style={{
                            background: `${company.color}18`,
                            color: company.color,
                            borderColor: `${company.color}35`,
                          }}
                        >
                          <Building2 className="w-2.5 h-2.5" />
                          {company.shortName}
                        </span>
                      </div>
                    </div>

                    {/* Menu de ações (admin) */}
                    {isAdmin && (
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-zinc-700 text-zinc-400 transition-all">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-zinc-900 border-zinc-700/50 w-44">
                          <DropdownMenuItem
                            className="flex items-center gap-2 text-zinc-300 focus:bg-zinc-800"
                            onClick={() => setEditingCompany(company)}
                          >
                            <Pencil className="w-3.5 h-3.5" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 text-red-400 focus:text-red-400 focus:bg-red-500/10"
                            onClick={() => handleDelete(company)}
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  {/* CNPJ */}
                  {company.cnpj && (
                    <p className="text-xs text-zinc-500 mb-3 font-mono">{company.cnpj}</p>
                  )}

                  {/* Projetos vinculados */}
                  <div className="pt-3 border-t border-zinc-800/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <FolderKanban className="w-3.5 h-3.5 text-zinc-600" />
                        <span>
                          {linkedProjects.length === 0
                            ? "Nenhum projeto vinculado"
                            : `${linkedProjects.length} projeto${linkedProjects.length !== 1 ? "s" : ""} vinculado${linkedProjects.length !== 1 ? "s" : ""}`}
                        </span>
                      </div>
                    </div>
                    {linkedProjects.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {linkedProjects.slice(0, 4).map((p) => (
                          <span
                            key={p.id}
                            className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700/50 text-[10px] text-zinc-400 truncate max-w-[120px]"
                          >
                            {p.name}
                          </span>
                        ))}
                        {linkedProjects.length > 4 && (
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700/50 text-[10px] text-zinc-500">
                            +{linkedProjects.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dialog criar */}
      <CompanyFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        defaultValues={createDefaults}
        onSubmit={handleCreate}
        title="Nova Empresa"
      />

      {/* Dialog editar */}
      {editingCompany && (
        <CompanyFormDialog
          open={!!editingCompany}
          onOpenChange={(v) => { if (!v) setEditingCompany(null); }}
          defaultValues={{
            name: editingCompany.name,
            shortName: editingCompany.shortName,
            color: editingCompany.color,
            cnpj: editingCompany.cnpj ?? "",
          }}
          onSubmit={handleEdit}
          title="Editar Empresa"
        />
      )}
    </>
  );
}
