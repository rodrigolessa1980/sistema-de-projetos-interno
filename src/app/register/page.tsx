"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/lib/router";
import Link from "@/lib/router";
import { motion } from "@/lib/motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Zap, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { listTenants } from "@/lib/auth";
import type { TenantOption } from "@/types";

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  position: z.string().min(2, "Cargo deve ter pelo menos 2 caracteres"),
  department: z.string().min(2, "Departamento deve ter pelo menos 2 caracteres"),
  tenantSlug: z.string().min(1, "Selecione um grupo"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register, isLoading, error, isAuthenticated, clearError } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [tenants, setTenants] = useState<TenantOption[]>([]);

  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated, router]);

  useEffect(() => {
    listTenants()
      .then(setTenants)
      .catch(() => setTenants([]));
  }, []);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      position: "",
      department: "",
      tenantSlug: "",
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    clearError();
    await register(data);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Painel Esquerdo com Gradiente */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border-r border-zinc-800/50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">DevFlow</span>
        </div>

        <div className="relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Comece a gerenciar seu time
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                de forma inteligente
              </span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
              Crie sua conta agora para gerenciar tarefas, cronogramas e métricas avançadas em tempo real.
            </p>
          </motion.div>
        </div>

        <p className="relative text-xs text-zinc-600">© 2026 DevFlow. Todos os direitos reservados.</p>
      </div>

      {/* Painel Direito com Formulário */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md py-8"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">DevFlow</span>
          </div>

          <h1 className="text-2xl font-bold text-zinc-100 mb-1">Criar sua conta</h1>
          <p className="text-sm text-zinc-500 mb-8">Preencha os dados abaixo para se cadastrar</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-zinc-300 text-sm">Nome Completo</Label>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Seu nome"
                        className="bg-zinc-800/50 border-zinc-700/50 text-zinc-100 placeholder-zinc-500 focus:border-violet-500/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-zinc-300 text-sm">E-mail</Label>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="seu@email.com"
                        className="bg-zinc-800/50 border-zinc-700/50 text-zinc-100 placeholder-zinc-500 focus:border-violet-500/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-zinc-300 text-sm">Senha</Label>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 6 caracteres"
                          className="bg-zinc-800/50 border-zinc-700/50 text-zinc-100 placeholder-zinc-500 focus:border-violet-500/50 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-zinc-300 text-sm">Cargo</Label>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Ex: Dev Frontend"
                          className="bg-zinc-800/50 border-zinc-700/50 text-zinc-100 placeholder-zinc-500 focus:border-violet-500/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-zinc-300 text-sm">Departamento</Label>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Ex: Engenharia"
                          className="bg-zinc-800/50 border-zinc-700/50 text-zinc-100 placeholder-zinc-500 focus:border-violet-500/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tenantSlug"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-zinc-300 text-sm">Grupo</Label>
                    <FormControl>
                      <select
                        {...field}
                        className="h-9 w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-2.5 py-1 text-sm text-zinc-100 placeholder-zinc-500 focus:border-violet-500/50 focus:outline-none"
                      >
                        <option value="" className="bg-zinc-900 text-zinc-100">Selecione seu grupo…</option>
                        {tenants.map((t) => (
                          <option key={t.id} value={t.slug} className="bg-zinc-900 text-zinc-100">
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="text-xs text-zinc-500">
                Após o cadastro, um administrador do grupo precisa aprovar seu acesso.
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                >
                  <p className="text-sm text-red-400">{error}</p>
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registrando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Cadastrar
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </Form>

          <p className="text-sm text-zinc-400 text-center mt-6">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-violet-400 hover:text-violet-300 font-semibold underline underline-offset-4"
            >
              Fazer login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
