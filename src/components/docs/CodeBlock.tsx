"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  children: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  children,
  language = "text",
  title,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = children.split("\n");

  return (
    <div className="bg-muted/50 relative overflow-hidden rounded-lg border p-0">
      {title && (
        <div className="bg-muted flex items-center justify-between border-b px-4 py-2">
          <span className="text-sm font-medium">{title}</span>
          <span className="text-muted-foreground text-xs uppercase">
            {language}
          </span>
        </div>
      )}

      <div className="relative">
        <pre className="overflow-x-auto p-4 text-sm">
          <code className={`language-${language}`}>
            {showLineNumbers ? (
              <table>
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={index}>
                      <td className="text-muted-foreground pr-3 text-right select-none">
                        {index + 1}
                      </td>
                      <td className="whitespace-pre">{line}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              children
            )}
          </code>
        </pre>

        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
