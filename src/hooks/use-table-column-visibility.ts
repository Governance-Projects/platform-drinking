"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useCallback, useMemo } from "react";
import type { VisibilityState } from "@tanstack/react-table";

/**
 * Cria um atom do Jotai que persiste as colunas ocultas no localStorage
 */
const createTableColumnVisibilityAtom = (tableId: string) => {
  const storageKey = `table-column-visibility-${tableId}`;
  return atomWithStorage<string[]>(storageKey, []);
};

/**
 * Hook reutilizável para gerenciar a visibilidade de colunas de uma tabela
 * com persistência no localStorage usando Jotai.
 *
 * @param tableId - ID único da tabela (ex: "bebedouros", "usuarios")
 * @returns Tupla [columnVisibility, setColumnVisibility] compatível com TanStack Table
 *
 * @example
 * ```tsx
 * const [columnVisibility, setColumnVisibility] = useTableColumnVisibility("bebedouros");
 * ```
 */
export function useTableColumnVisibility(tableId: string) {
  // Cria ou obtém o atom para esta tabela específica
  const hiddenColumnsAtom = useMemo(
    () => createTableColumnVisibilityAtom(tableId),
    [tableId],
  );

  // Lê e escreve no atom
  const [hiddenColumns, setHiddenColumns] = useAtom(hiddenColumnsAtom);

  // Converte array de colunas ocultas para VisibilityState do TanStack Table
  const columnVisibility = useMemo<VisibilityState>(() => {
    const visibility: VisibilityState = {};
    hiddenColumns.forEach((columnId) => {
      visibility[columnId] = false;
    });
    return visibility;
  }, [hiddenColumns]);

  // Converte VisibilityState do TanStack Table para array de colunas ocultas
  const setColumnVisibility = useCallback(
    (
      updater: VisibilityState | ((prev: VisibilityState) => VisibilityState),
    ) => {
      setHiddenColumns((prevHidden) => {
        // Reconstrói o estado anterior completo
        const prevVisibility = prevHidden.reduce<VisibilityState>(
          (acc, colId) => {
            acc[colId] = false;
            return acc;
          },
          {},
        );

        // Aplica o updater (pode ser função ou objeto)
        const newVisibility =
          typeof updater === "function" ? updater(prevVisibility) : updater;

        // Extrai apenas as colunas ocultas (false) do novo estado
        // O TanStack Table pode passar apenas as colunas que mudaram,
        // então precisamos mesclar com o estado anterior
        const allColumnIds = new Set([
          ...prevHidden,
          ...Object.keys(newVisibility),
        ]);

        const newHiddenColumns = Array.from(allColumnIds).filter((columnId) => {
          // Se a coluna está no novo estado, usa esse valor
          if (columnId in newVisibility) {
            return !newVisibility[columnId];
          }
          // Caso contrário, mantém o estado anterior (oculta se estava oculta)
          return prevHidden.includes(columnId);
        });

        return newHiddenColumns;
      });
    },
    [setHiddenColumns],
  );

  return [columnVisibility, setColumnVisibility] as const;
}
