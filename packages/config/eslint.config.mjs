// Configuracion base de ESLint compartida por todo el monorepo.
// Cada app la extiende y anade lo suyo (ej. next/core-web-vitals).

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/.turbo/**",
      "**/src/generated/**",
    ],
  },
  {
    rules: {
      // El nucleo no debe importar de las apps: la dependencia va en un solo sentido.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@appstore/web/*", "@appstore/admin/*"],
              message:
                "packages/* no puede importar de apps/*. La logica compartida va en @appstore/core.",
            },
          ],
        },
      ],
    },
  },
];
