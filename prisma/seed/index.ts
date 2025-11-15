import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  const services = [
    { name: "Desinfecção cuba" },
    { name: "Limpeza externa" },
    { name: "Higienização completa" },
    { name: "Verificação vazamentos" },
    { name: "Limpeza rápida" },
    { name: "Higienização dosadores" },
    { name: "Verificação visual" },
    { name: "Teste funcionamento" },
    { name: "Remoção filtro" },
    { name: "Instalação filtro" },
    { name: "Registro lote" },
    { name: "Teste qualidade" },
    { name: "Diagnóstico problema" },
    { name: "Execução reparo" },
    { name: "Substituição peças" },
    { name: "Teste final" },
  ];

  await prisma.sinkMaintanceService.createMany({
    data: services,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
