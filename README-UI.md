# 🎨 Guia de UI: Tailwind CSS + shadcn/ui

Este projeto utiliza **Tailwind CSS v4** e **shadcn/ui** para criar uma interface moderna e responsiva. Este guia mostra as melhores práticas para usar essas ferramentas.

## 📚 Documentação Oficial

- 📖 **Tailwind CSS v4**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- 🎨 **shadcn/ui**: [https://ui.shadcn.com](https://ui.shadcn.com)
- ⚡ **Next.js**: [https://nextjs.org/docs](https://nextjs.org/docs)

## 🛠️ Configuração Atual

### Tailwind CSS v4

- ✅ **Configuração**: `tailwind.config.ts`
- ✅ **Estilos globais**: `src/styles/globals.css`
- ✅ **PostCSS**: `postcss.config.js`
- ✅ **Tema personalizado** com variáveis CSS
- ✅ **Dark mode** configurado

### shadcn/ui

- ✅ **Estilo**: New York
- ✅ **Biblioteca de ícones**: Lucide React
- ✅ **Componentes**: `src/components/ui/`
- ✅ **Utilitários**: `src/lib/utils.ts`
- ✅ **CSS Variables** habilitado

## 🎯 Melhores Práticas

### 1. 📁 Estrutura de Componentes

```
src/
├── components/
│   ├── ui/               # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── ...
│   └── custom/           # Seus componentes personalizados
│       ├── header.tsx
│       └── ...
├── lib/
│   └── utils.ts          # Utilitários (cn, etc.)
└── styles/
    └── globals.css       # Estilos globais + Tailwind
```

### 2. 🎨 Sistema de Cores

Use as variáveis CSS configuradas no tema:

```tsx
// ✅ Recomendado - usando as variáveis do tema
<div className="bg-primary text-primary-foreground">
  <h1 className="text-background">Título</h1>
</div>

// ❌ Evite - cores fixas
<div className="bg-blue-500 text-white">
  <h1 className="text-gray-900">Título</h1>
</div>
```

**Cores disponíveis:**

- `background` / `foreground`
- `primary` / `primary-foreground`
- `secondary` / `secondary-foreground`
- `muted` / `muted-foreground`
- `accent` / `accent-foreground`
- `destructive` / `destructive-foreground`
- `border` / `input` / `ring`

### 3. 🌙 Dark Mode

O dark mode funciona automaticamente com as variáveis CSS:

```tsx
// Aplique a classe 'dark' no elemento raiz
<html className="dark">{/* Componentes automaticamente se adaptam */}</html>
```

### 4. 📱 Responsividade

Use os breakpoints do Tailwind:

```tsx
<div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 md:p-6 lg:grid-cols-3 lg:p-8">
  {/* Conteúdo responsivo */}
</div>
```

**Breakpoints:**

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🧩 Usando shadcn/ui

### 1. 📦 Adicionando Novos Componentes

```bash
# Adicionar um componente específico
pnpm dlx shadcn@latest add button

# Adicionar múltiplos componentes
pnpm dlx shadcn@latest add button input label

# Ver componentes disponíveis
pnpm dlx shadcn@latest add
```

### 2. 💡 Exemplos de Uso

#### Button Component

```tsx
import { Button } from "~/components/ui/button";

export function Example() {
  return (
    <div className="space-y-4">
      <Button variant="default">Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="outline">Outline Button</Button>
      <Button variant="ghost">Ghost Button</Button>
      <Button variant="destructive">Destructive Button</Button>
    </div>
  );
}
```

#### Form Components

```tsx
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function LoginForm() {
  return (
    <form className="mx-auto max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input id="password" type="password" className="w-full" />
      </div>

      <Button type="submit" className="w-full">
        Entrar
      </Button>
    </form>
  );
}
```

### 3. 🎨 Customizando Componentes

```tsx
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

// Criando uma variante personalizada
export function CustomButton({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        "bg-gradient-to-r from-purple-500 to-pink-500",
        "hover:from-purple-600 hover:to-pink-600",
        "text-white shadow-lg",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
```

## 🎯 Utilitários Importantes

### 1. 🔧 cn() Function

Utilitário para combinar classes condicionalmente:

```tsx
import { cn } from "~/lib/utils";

export function Card({ className, isActive, ...props }) {
  return (
    <div
      className={cn(
        "bg-card rounded-lg border p-6",
        isActive && "ring-primary ring-2",
        className,
      )}
      {...props}
    />
  );
}
```

### 2. 📐 Variantes com CVA

Use `class-variance-authority` para criar variantes:

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const alertVariants = cva(
  "rounded-lg border p-4", // classes base
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
      },
      size: {
        sm: "text-sm p-3",
        md: "text-base p-4",
        lg: "text-lg p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export function Alert({ className, variant, size, ...props }: AlertProps) {
  return (
    <div
      className={cn(alertVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

## 🚀 Comandos Úteis

```bash
# Desenvolvimento
pnpm run dev

# Build para produção
pnpm run build

# Verificar tipos e lint
pnpm run check

# Adicionar componente shadcn/ui
pnpm dlx shadcn@latest add [component-name]

# Ver todos os componentes disponíveis
pnpm dlx shadcn@latest add
```

## 📖 Recursos Adicionais

### Documentação Específica

- 🎨 **Cores**: [Tailwind Colors](https://tailwindcss.com/docs/customizing-colors)
- 📱 **Responsive**: [Tailwind Responsive](https://tailwindcss.com/docs/responsive-design)
- 🌙 **Dark Mode**: [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- 🧩 **shadcn/ui Components**: [Component Library](https://ui.shadcn.com/docs/components)

### Ferramentas

- 🎨 **Tailwind UI**: [tailwindui.com](https://tailwindui.com) - Componentes premium
- 🎯 **Tailwind Play**: [play.tailwindcss.com](https://play.tailwindcss.com) - Playground online
- 🔍 **Tailwind CSS IntelliSense**: Extensão VS Code

### Inspiração

- 📱 **Tailwind Components**: [tailwindcomponents.com](https://tailwindcomponents.com)
- 🎨 **UI Verse**: [uiverse.io](https://uiverse.io)
- 💡 **Tailwind Examples**: [tailwindcss.com/components](https://tailwindcss.com/components)

## ⚡ Dicas de Performance

1. **Use JIT Mode**: Já habilitado no Tailwind v4
2. **Purge CSS**: Configurado automaticamente
3. **Componente Lazy**: Use `React.lazy()` para componentes grandes
4. **Otimize Imports**: Importe apenas o que precisar

```tsx
// ✅ Import específico
import { Button } from "~/components/ui/button";

// ❌ Import geral (evite)
import * as UI from "~/components/ui";
```

---

## 🎯 Quick Start

Para começar rapidamente:

1. **Criar componente**:

```bash
pnpm dlx shadcn@latest add button
```

2. **Usar no código**:

```tsx
import { Button } from "~/components/ui/button";

export default function Page() {
  return <Button>Clique aqui</Button>;
}
```

3. **Personalizar com Tailwind**:

```tsx
<Button className="bg-gradient-to-r from-blue-500 to-purple-600">
  Botão Customizado
</Button>
```

🎉 **Pronto para criar interfaces incríveis!**
