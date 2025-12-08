import * as React from "react";

// Variants are capped to five to keep the design system tight.
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "md" | "lg";

const baseClasses =
  "inline-flex items-center justify-center font-semibold rounded-lg border transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60 disabled:cursor-not-allowed gap-2";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-surface border-primary shadow-subtle hover:-translate-y-0.5 hover:shadow-lg hover:bg-primary/90 active:translate-y-0",
  secondary:
    "bg-surface text-primary border-primary/30 hover:border-accent hover:bg-surface/90 shadow-subtle",
  outline:
    "bg-transparent text-primary border-primary hover:bg-primary/10 hover:text-foreground shadow-none",
  ghost:
    "bg-transparent text-foreground border-transparent hover:border-border hover:bg-primary/5 shadow-none",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};

function cx(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

export function buttonClass(options?: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}) {
  const {
    variant = "primary",
    size = "md",
    fullWidth = false,
    className,
  } = options || {};

  return cx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", fullWidth, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonClass({ variant, size, fullWidth, className })}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
