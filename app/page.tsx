"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";

type Species = "perro" | "gato";

interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  age: string;
  gender: "Macho" | "Hembra";
  size: "Pequeño" | "Mediano" | "Grande";
  weight: string;
  description: string;
  traits: string[];
  image: string;
  accentColor: string;
}

const PETS: Pet[] = [
  {
    id: "milo",
    name: "Milo",
    species: "perro",
    breed: "Golden Retriever",
    age: "2 años",
    gender: "Macho",
    size: "Grande",
    weight: "28 kg",
    description:
      "Compañero noble y luminoso. Disfruta de las caminatas matutinas al sol y descansar cerca de la ventana.",
    traits: ["Sociable", "Tranquilo", "Leal"],
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80",
    accentColor: "bg-amber-50 text-amber-800 border-amber-200/70",
  },
  {
    id: "luna",
    name: "Luna",
    species: "gato",
    breed: "British Shorthair",
    age: "1 año",
    gender: "Hembra",
    size: "Mediano",
    weight: "4.2 kg",
    description:
      "Serena y observadora. Le encantan los espacios silenciosos, las mantas de lino y los juegos suaves al atardecer.",
    traits: ["Cariñosa", "Curiosa", "Silenciosa"],
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80",
    accentColor: "bg-teal-50 text-teal-800 border-teal-200/70",
  },
  {
    id: "coco",
    name: "Coco",
    species: "perro",
    breed: "Corgi Galés",
    age: "3 años",
    gender: "Macho",
    size: "Pequeño",
    weight: "11 kg",
    description:
      "Alegre, expresivo y siempre atento. Se adapta perfecto a departamentos luminosos y paseos cortos por el parque.",
    traits: ["Juguetón", "Inteligente", "Amigable"],
    image:
      "https://images.unsplash.com/photo-1612536057832-2ff7ead58194?auto=format&fit=crop&w=900&q=80",
    accentColor: "bg-amber-50 text-amber-800 border-amber-200/70",
  },
  {
    id: "olivia",
    name: "Olivia",
    species: "gato",
    breed: "Siamés Moderno",
    age: "2 años",
    gender: "Hembra",
    size: "Pequeño",
    weight: "3.6 kg",
    description:
      "Elegante y comunicativa. Busca rincones cálidos donde tomar sol y disfruta la compañía cercana.",
    traits: ["Elegante", "Afectuosa", "Ágil"],
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=80",
    accentColor: "bg-teal-50 text-teal-800 border-teal-200/70",
  },
  {
    id: "bruno",
    name: "Bruno",
    species: "perro",
    breed: "Border Collie",
    age: "1.5 años",
    gender: "Macho",
    size: "Mediano",
    weight: "19 kg",
    description:
      "Mirada atenta y espíritu equilibrado. Aprende rápido y transmite calma después de cada paseo al aire libre.",
    traits: ["Atento", "Noble", "Activo"],
    image:
      "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&w=900&q=80",
    accentColor: "bg-amber-50 text-amber-800 border-amber-200/70",
  },
  {
    id: "nala",
    name: "Nala",
    species: "gato",
    breed: "Europeo Naranja",
    age: "8 meses",
    gender: "Hembra",
    size: "Pequeño",
    weight: "2.9 kg",
    description:
      "Dulce y apacible. Su ronroneo suave llena de calidez cualquier habitación desde el primer momento.",
    traits: ["Dulce", "Pacífica", "Sociable"],
    image:
      "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=80",
    accentColor: "bg-teal-50 text-teal-800 border-teal-200/70",
  },
];

export default function Home() {
  const [filter, setFilter] = useState<"todos" | Species>("todos");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  useEffect(() => {
    if (!selectedPet) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPet(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPet]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredPets = useMemo(() => {
    return PETS.filter((pet) => {
      const matchesSpecies = filter === "todos" || pet.species === filter;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        pet.name.toLowerCase().includes(query) ||
        pet.breed.toLowerCase().includes(query) ||
        pet.traits.some((t) => t.toLowerCase().includes(query));
      const matchesFav = !onlyFavorites || favorites.includes(pet.id);
      return matchesSpecies && matchesSearch && matchesFav;
    });
  }, [filter, search, onlyFavorites, favorites]);

  const counts = useMemo(
    () => ({
      todos: PETS.length,
      perro: PETS.filter((p) => p.species === "perro").length,
      gato: PETS.filter((p) => p.species === "gato").length,
    }),
    []
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-stone-800">
      {/* Header minimalista */}
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[#faf9f6]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-lg shadow-2xs"
            >
              🐾
            </span>
            <div>
              <span className="text-base font-semibold tracking-tight text-stone-900">
                Huellas
              </span>
              <span className="hidden sm:inline-block ml-2 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-500">
                Perros & Gatos
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setOnlyFavorites((prev) => !prev)}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                onlyFavorites
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900"
              }`}
            >
              <span aria-hidden="true">{onlyFavorites ? "♥" : "♡"}</span>
              <span>Favoritos</span>
              <span className="rounded-full bg-stone-100 px-1.5 py-0.5 text-xs text-stone-700">
                {favorites.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="mx-auto flex-1 w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Hero Section */}
        <section className="mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium tracking-wide text-stone-500 uppercase">
              Galería de compañeros
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
              Perros y gatos en un espacio claro y sereno.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
              Explora nuestra selección minimalista de perros y gatos. Filtra
              por especie, busca por raza o temperamento y conoce la historia
              de cada compañero.
            </p>
          </div>

          {/* Controles de filtro y búsqueda */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Pestañas de categoría */}
            <div
              role="tablist"
              aria-label="Filtrar por especie"
              className="inline-flex self-start rounded-2xl border border-stone-200/90 bg-white p-1 shadow-2xs"
            >
              {(
                [
                  { key: "todos", label: "Todos", count: counts.todos },
                  { key: "perro", label: "Perros", count: counts.perro },
                  { key: "gato", label: "Gatos", count: counts.gato },
                ] as const
              ).map((tab) => {
                const active = filter === tab.key;
                return (
                  <button
                    key={tab.key}
                    role="tab"
                    aria-selected={active}
                    type="button"
                    onClick={() => setFilter(tab.key)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      active
                        ? "bg-stone-900 text-stone-50 shadow-2xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-xs ${
                        active
                          ? "bg-stone-700 text-stone-100"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Buscador minimalista */}
            <div className="relative w-full sm:w-72">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, raza o rasgo..."
                aria-label="Buscar mascotas"
                className="w-full rounded-2xl border border-stone-200 bg-white py-2.5 pr-4 pl-10 text-sm text-stone-800 placeholder-stone-400 shadow-2xs transition focus:border-stone-400 focus:outline-none"
              />
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-stone-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* Grid responsive de tarjetas */}
        {filteredPets.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-200 bg-white/70 p-12 text-center">
            <p className="text-base font-medium text-stone-700">
              No encontramos compañeros con esos filtros.
            </p>
            <p className="mt-1 text-sm text-stone-500">
              Prueba limpiando la búsqueda o cambiando la categoría seleccionada.
            </p>
            <button
              type="button"
              onClick={() => {
                setFilter("todos");
                setSearch("");
                setOnlyFavorites(false);
              }}
              className="mt-5 inline-flex items-center rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-700 hover:border-stone-300 hover:bg-stone-50"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <section
            aria-label="Listado de perros y gatos"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredPets.map((pet) => {
              const isFav = favorites.includes(pet.id);
              return (
                <article
                  key={pet.id}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
                >
                  {/* Imagen */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                    <Image
                      src={pet.image}
                      alt={`${pet.name} - ${pet.breed}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-xs ${pet.accentColor}`}
                      >
                        <span aria-hidden="true">
                          {pet.species === "perro" ? "🐶" : "🐱"}
                        </span>
                        <span className="capitalize">{pet.species}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFavorite(pet.id)}
                      aria-label={
                        isFav
                          ? `Quitar a ${pet.name} de favoritos`
                          : `Agregar a ${pet.name} a favoritos`
                      }
                      className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition ${
                        isFav
                          ? "border-rose-200 bg-rose-50/95 text-rose-600"
                          : "border-white/60 bg-white/85 text-stone-600 hover:bg-white hover:text-stone-900"
                      }`}
                    >
                      {isFav ? "♥" : "♡"}
                    </button>
                  </div>

                  {/* Cuerpo de tarjeta */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <h2 className="text-xl font-semibold tracking-tight text-stone-900">
                          {pet.name}
                        </h2>
                        <span className="text-xs font-medium text-stone-500">
                          {pet.age} · {pet.gender}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs font-medium text-stone-400">
                        {pet.breed}
                      </p>

                      <p className="mt-3 text-sm leading-relaxed text-stone-600">
                        {pet.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-stone-100">
                      <div className="flex flex-wrap gap-1.5">
                        {pet.traits.map((trait) => (
                          <span
                            key={trait}
                            className="rounded-full bg-stone-100/90 px-2.5 py-1 text-xs font-medium text-stone-600"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-stone-400">
                          Tamaño: <strong className="font-medium text-stone-600">{pet.size}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedPet(pet)}
                          className="text-xs font-semibold text-stone-800 underline-offset-4 hover:underline"
                        >
                          Ver ficha →
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>

      {/* Modal minimalista de detalle */}
      {selectedPet && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pet-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/30 p-4 backdrop-blur-xs"
          onClick={() => setSelectedPet(null)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full bg-stone-100">
              <Image
                src={selectedPet.image}
                alt={selectedPet.name}
                fill
                sizes="(max-width: 640px) 100vw, 512px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedPet(null)}
                aria-label="Cerrar ventana"
                className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white/90 text-stone-700 shadow-2xs hover:bg-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${selectedPet.accentColor}`}
                  >
                    {selectedPet.species === "perro" ? "🐶 Perro" : "🐱 Gato"}
                  </span>
                  <h3
                    id="pet-modal-title"
                    className="mt-2 text-2xl font-semibold text-stone-900"
                  >
                    {selectedPet.name}
                  </h3>
                  <p className="text-sm text-stone-500">{selectedPet.breed}</p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFavorite(selectedPet.id)}
                  className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                    favorites.includes(selectedPet.id)
                      ? "border-rose-200 bg-rose-50 text-rose-700"
                      : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  {favorites.includes(selectedPet.id)
                    ? "♥ En favoritos"
                    : "♡ Guardar"}
                </button>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-stone-600">
                {selectedPet.description}
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl bg-stone-50 p-3.5 text-center border border-stone-100">
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-stone-400">
                    Edad
                  </span>
                  <span className="mt-0.5 block text-sm font-medium text-stone-800">
                    {selectedPet.age}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-stone-400">
                    Tamaño
                  </span>
                  <span className="mt-0.5 block text-sm font-medium text-stone-800">
                    {selectedPet.size}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-stone-400">
                    Peso aprox.
                  </span>
                  <span className="mt-0.5 block text-sm font-medium text-stone-800">
                    {selectedPet.weight}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedPet(null)}
                  className="rounded-full bg-stone-900 px-5 py-2.5 text-xs font-medium text-white hover:bg-stone-800"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer minimalista */}
      <footer className="border-t border-stone-200/70 bg-white/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-stone-400 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 Huellas. Diseño minimalista y claro.</p>
          <p>Hecho con Next.js y Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}
