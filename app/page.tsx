"use client";

import { useState, useMemo, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";

type Species = "perro" | "gato";
type PetSize = "Pequeño" | "Mediano" | "Grande";
type PetGender = "Macho" | "Hembra";
type CardTab = "historia" | "salud" | "hogar";
type ModalTab = "resumen" | "salud" | "hogar" | "adoptar";
type SortOption = "destacados" | "nombre" | "edad-asc" | "edad-desc" | "aporte-asc";
type KitCategory = "todos" | "perro" | "gato" | "accesorios";

interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  age: string;
  ageMonths: number;
  gender: PetGender;
  size: PetSize;
  weight: string;
  adoptionFee: number;
  badge?: string;
  description: string;
  story: string;
  traits: string[];
  includedItems: string[];
  image: string;
  accentColor: string;
  health: {
    vaccinated: boolean;
    sterilized: boolean;
    microchip: boolean;
    energyLevel: "Baja" | "Media" | "Alta";
    routine: string;
  };
  idealHome: {
    housing: string;
    kidsFriendly: boolean;
    otherPetsFriendly: boolean;
    summary: string;
  };
}

interface StarterKit {
  id: string;
  name: string;
  category: "perro" | "gato" | "accesorios";
  price: number;
  tag: string;
  description: string;
  items: string[];
  icon: string;
}

const PETS: Pet[] = [
  {
    id: "milo",
    name: "Milo",
    species: "perro",
    breed: "Golden Retriever",
    age: "2 años",
    ageMonths: 24,
    gender: "Macho",
    size: "Grande",
    weight: "28 kg",
    adoptionFee: 35,
    badge: "Compañero del mes",
    description:
      "Compañero noble y luminoso. Disfruta de las caminatas matutinas al sol y descansar cerca de la ventana.",
    story:
      "Milo creció rodeado de cariño y naturaleza. Es un perro sumamente receptivo que saluda con entusiasmo suave y sabe acompañar en silencio mientras trabajas o lees.",
    traits: ["Sociable", "Tranquilo", "Leal"],
    includedItems: [
      "Carnet de vacunación al día",
      "Microchip registrado",
      "Collar de algodón orgánico",
      "1ª consulta veterinaria gratis",
    ],
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80",
    accentColor: "bg-amber-50 text-amber-800 border-amber-200/70",
    health: {
      vaccinated: true,
      sterilized: true,
      microchip: true,
      energyLevel: "Media",
      routine: "Dos paseos diarios de 30 minutos y cepillado semanal.",
    },
    idealHome: {
      housing: "Casa con patio o departamento amplio",
      kidsFriendly: true,
      otherPetsFriendly: true,
      summary:
        "Ideal para familias o personas que disfruten de paseos al aire libre y busquen un compañero afectuoso.",
    },
  },
  {
    id: "luna",
    name: "Luna",
    species: "gato",
    breed: "British Shorthair",
    age: "1 año",
    ageMonths: 12,
    gender: "Hembra",
    size: "Mediano",
    weight: "4.2 kg",
    adoptionFee: 30,
    badge: "Ideal depto",
    description:
      "Serena y observadora. Le encantan los espacios silenciosos, las mantas de lino y los juegos suaves al atardecer.",
    story:
      "Luna tiene una personalidad calmada y dulce. Se acerca con delicadeza cuando busca mimos y disfruta observar el movimiento de las hojas desde el balcón protegido.",
    traits: ["Cariñosa", "Curiosa", "Silenciosa"],
    includedItems: [
      "Vacunación triple felina",
      "Esterilización certificada",
      "Manta con aroma familiar",
      "Guía de adaptación felina",
    ],
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80",
    accentColor: "bg-teal-50 text-teal-800 border-teal-200/70",
    health: {
      vaccinated: true,
      sterilized: true,
      microchip: true,
      energyLevel: "Baja",
      routine: "Juego interactivo de 15 minutos por la tarde y cepillado suave.",
    },
    idealHome: {
      housing: "Departamento o casa tranquila",
      kidsFriendly: true,
      otherPetsFriendly: true,
      summary:
        "Perfecta para hogares serenos donde valoren la compañía tranquila y los momentos de lectura en el sofá.",
    },
  },
  {
    id: "coco",
    name: "Coco",
    species: "perro",
    breed: "Corgi Galés",
    age: "3 años",
    ageMonths: 36,
    gender: "Macho",
    size: "Pequeño",
    weight: "11 kg",
    adoptionFee: 35,
    badge: "Muy sociable",
    description:
      "Alegre, expresivo y siempre atento. Se adapta perfecto a departamentos luminosos y paseos cortos por el parque.",
    story:
      "Coco destaca por su simpatía e inteligencia. Conoce juegos de búsqueda básicos y le encanta socializar con vecinos y otros perros durante sus recorridos diarios.",
    traits: ["Juguetón", "Inteligente", "Amigable"],
    includedItems: [
      "Vacunas y desparasitación",
      "Microchip identificatorio",
      "Arnés ergonómico de paseo",
      "Bolsa de premios naturales",
    ],
    image:
      "https://images.unsplash.com/photo-1612536057832-2ff7ead58194?auto=format&fit=crop&w=900&q=80",
    accentColor: "bg-amber-50 text-amber-800 border-amber-200/70",
    health: {
      vaccinated: true,
      sterilized: true,
      microchip: true,
      energyLevel: "Media",
      routine: "Paseos cortos dinámicos y juegos de estimulación mental.",
    },
    idealHome: {
      housing: "Departamento luminoso o casa",
      kidsFriendly: true,
      otherPetsFriendly: true,
      summary:
        "Excelente para quienes viven en ciudad y quieren un compañero compacto, alegre y muy expresivo.",
    },
  },
  {
    id: "olivia",
    name: "Olivia",
    species: "gato",
    breed: "Siamés Moderno",
    age: "2 años",
    ageMonths: 24,
    gender: "Hembra",
    size: "Pequeño",
    weight: "3.6 kg",
    adoptionFee: 30,
    description:
      "Elegante y comunicativa. Busca rincones cálidos donde tomar sol y disfruta la compañía cercana.",
    story:
      "Olivia conversa con maullidos suaves cuando llegas a casa. Es muy apegada a sus personas favoritas y disfruta descansar en alturas o junto al escritorio.",
    traits: ["Elegante", "Afectuosa", "Ágil"],
    includedItems: [
      "Control sano completo",
      "Esterilización y microchip",
      "Juguete interactivo de plumas",
      "Asesoría nutricional",
    ],
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=80",
    accentColor: "bg-teal-50 text-teal-800 border-teal-200/70",
    health: {
      vaccinated: true,
      sterilized: true,
      microchip: true,
      energyLevel: "Media",
      routine: "Rascadores altos, juguetes de plumas y compañía frecuente.",
    },
    idealHome: {
      housing: "Departamento con ventanas soleadas",
      kidsFriendly: false,
      otherPetsFriendly: true,
      summary:
        "Ideal para personas que trabajan desde casa o buscan una gata muy compañera y comunicativa.",
    },
  },
  {
    id: "bruno",
    name: "Bruno",
    species: "perro",
    breed: "Border Collie",
    age: "1.5 años",
    ageMonths: 18,
    gender: "Macho",
    size: "Mediano",
    weight: "19 kg",
    adoptionFee: 35,
    badge: "Espíritu activo",
    description:
      "Mirada atenta y espíritu equilibrado. Aprende rápido y transmite calma después de cada paseo al aire libre.",
    story:
      "Bruno combina agilidad y dulzura. Disfruta aprender nuevos trucos, correr en espacios abiertos y luego recostarse tranquilamente sobre su alfombra favorita.",
    traits: ["Atento", "Noble", "Activo"],
    includedItems: [
      "Esquema de vacunas completo",
      "Microchip y placa grabada",
      "Correa larga de entrenamiento",
      "Sesión de adaptación",
    ],
    image:
      "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&w=900&q=80",
    accentColor: "bg-amber-50 text-amber-800 border-amber-200/70",
    health: {
      vaccinated: true,
      sterilized: true,
      microchip: true,
      energyLevel: "Alta",
      routine: "Actividad física diaria al aire libre y juegos de agilidad.",
    },
    idealHome: {
      housing: "Casa con jardín o cerca de parques grandes",
      kidsFriendly: true,
      otherPetsFriendly: true,
      summary:
        "Pensado para personas activas que disfruten salir a correr, caminar o practicar actividades al aire libre.",
    },
  },
  {
    id: "nala",
    name: "Nala",
    species: "gato",
    breed: "Europeo Naranja",
    age: "8 meses",
    ageMonths: 8,
    gender: "Hembra",
    size: "Pequeño",
    weight: "2.9 kg",
    adoptionFee: 25,
    badge: "Cachorra dulce",
    description:
      "Dulce y apacible. Su ronroneo suave llena de calidez cualquier habitación desde el primer momento.",
    story:
      "Nala fue rescatada siendo muy pequeña y desde entonces demuestra una gratitud inmensa. Es confiada con las visitas y se adapta con facilidad a nuevas rutinas.",
    traits: ["Dulce", "Pacífica", "Sociable"],
    includedItems: [
      "Vacunación inicial completa",
      "Esterilización incluida",
      "Pelotas de fieltro artesanal",
      "Kit de alimento inicial 1 kg",
    ],
    image:
      "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=80",
    accentColor: "bg-teal-50 text-teal-800 border-teal-200/70",
    health: {
      vaccinated: true,
      sterilized: true,
      microchip: false,
      energyLevel: "Media",
      routine: "Juegos suaves con pelotas de fieltro y siestas al sol.",
    },
    idealHome: {
      housing: "Cualquier hogar amoroso y seguro",
      kidsFriendly: true,
      otherPetsFriendly: true,
      summary:
        "Excelente primera mascota tanto para familias con niños como para personas que viven solas.",
    },
  },
];

const STARTER_KITS: StarterKit[] = [
  {
    id: "kit-perro-esencial",
    name: "Kit Bienvenida Canino",
    category: "perro",
    price: 42,
    tag: "Más elegido",
    description:
      "Todo lo necesario para los primeros días de tu nuevo perro en casa con materiales suaves y duraderos.",
    items: [
      "Cama acolchada de lino lavable",
      "Comedero y bebedero de cerámica",
      "Correa y arnés ergonómico tonos tierra",
      "Juguete mordedor de caucho natural",
    ],
    icon: "🦴",
  },
  {
    id: "kit-gato-sereno",
    name: "Kit Bienvenida Felino",
    category: "gato",
    price: 38,
    tag: "Recomendado",
    description:
      "Diseñado para que tu gato se sienta seguro, cómodo y estimulado desde su primer día en el hogar.",
    items: [
      "Rascador minimalista de sisal y madera",
      "Arenero cerrado con filtro de carbón",
      "Plato bajo anti-estrés de bigotes",
      "Set de 3 ratoncitos de fieltro orgánico",
    ],
    icon: "🧶",
  },
  {
    id: "kit-descanso-lino",
    name: "Cama Nube de Lino & Algodón",
    category: "accesorios",
    price: 29,
    tag: "Artesanal",
    description:
      "Funda 100% lino hipoalergénico en tono arena con relleno ortopédico para un descanso profundo.",
    items: [
      "Funda desmontable con cierre oculto",
      "Base antideslizante impermeable",
      "Apta para perros y gatos",
    ],
    icon: "☁️",
  },
  {
    id: "kit-paseo-seguro",
    name: "Set Paseo & Viaje Seguro",
    category: "accesorios",
    price: 24,
    tag: "Esencial",
    description:
      "Ideal para trasladar a tu compañero el día de la adopción y disfrutar paseos cómodos.",
    items: [
      "Bolso transportador ventilado",
      "Botella portátil de hidratación",
      "Placa grabada personalizada",
    ],
    icon: "🎒",
  },
];

const FAQS = [
  {
    question: "¿Qué cubre el aporte solidario de adopción?",
    answer:
      "El aporte solidario ayuda a cubrir los costos veterinarios previos (vacunación al día, desparasitación, esterilización y microchip) y permite que podamos seguir rescatando y cuidando a nuevos compañeros.",
  },
  {
    question: "¿Puedo conocer a la mascota antes de confirmar la adopción?",
    answer:
      "¡Por supuesto! Al agregar una mascota a tu solicitud puedes elegir agendar una visita presencial en nuestro espacio o una videollamada para conocer su carácter y conversar con nuestros cuidadores.",
  },
  {
    question: "¿Es obligatorio adquirir un Kit de Bienvenida?",
    answer:
      "No es obligatorio. Los Kits de Bienvenida son opcionales y están pensados para facilitarte todo lo necesario para el primer día a un precio solidario.",
  },
];

function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const EMPTY_FAVORITES: string[] = [];
let cachedFavoritesRaw: string | null = null;
let cachedFavoritesList: string[] = EMPTY_FAVORITES;

function subscribeFavorites(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("huellas-favorites-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("huellas-favorites-change", callback);
  };
}

function getFavoritesSnapshot(): string[] {
  try {
    const raw = localStorage.getItem("huellas_favorites");
    if (raw === cachedFavoritesRaw) return cachedFavoritesList;
    cachedFavoritesRaw = raw;
    if (!raw) {
      cachedFavoritesList = EMPTY_FAVORITES;
      return cachedFavoritesList;
    }
    const parsed = JSON.parse(raw);
    cachedFavoritesList = Array.isArray(parsed) ? parsed : EMPTY_FAVORITES;
    return cachedFavoritesList;
  } catch {
    return EMPTY_FAVORITES;
  }
}

function getFavoritesServerSnapshot(): string[] {
  return EMPTY_FAVORITES;
}

export default function Home() {
  // Estados de filtros de mascotas
  const [filter, setFilter] = useState<"todos" | Species>("todos");
  const [sizeFilter, setSizeFilter] = useState<"todos" | PetSize>("todos");
  const [genderFilter, setGenderFilter] = useState<"todos" | PetGender>("todos");
  const [sortBy, setSortBy] = useState<SortOption>("destacados");
  const [search, setSearch] = useState("");
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null);
  const favorites = useSyncExternalStore(
    subscribeFavorites,
    getFavoritesSnapshot,
    getFavoritesServerSnapshot
  );
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Pestañas internas en cada tarjeta de mascota
  const [cardTabs, setCardTabs] = useState<Record<string, CardTab>>({});

  // Modal de mascota seleccionada y su pestaña activa
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<ModalTab>("resumen");

  // Estados de la tienda / carrito de adopción
  const [adoptionList, setAdoptionList] = useState<string[]>([]);
  const [cartKits, setCartKits] = useState<Record<string, number>>({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [kitCategory, setKitCategory] = useState<KitCategory>("todos");

  // Formulario de adopción / checkout
  const [adoptionSubmittedFor, setAdoptionSubmittedFor] = useState<string[]>([]);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [applicantContact, setApplicantContact] = useState("");
  const [visitMode, setVisitMode] = useState<"presencial" | "videollamada">(
    "presencial"
  );
  const [applicantMessage, setApplicantMessage] = useState("");

  // Preguntas frecuentes abiertas
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const selectedPet = useMemo(
    () => PETS.find((p) => p.id === selectedPetId) ?? null,
    [selectedPetId]
  );

  const openPetDetail = (pet: Pet, initialTab: ModalTab = "resumen") => {
    setSelectedPetId(pet.id);
    setModalTab(initialTab);
  };

  const closePetDetail = () => {
    setSelectedPetId(null);
  };

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id)
      ? favorites.filter((item) => item !== id)
      : [...favorites, id];
    try {
      localStorage.setItem("huellas_favorites", JSON.stringify(next));
      window.dispatchEvent(new Event("huellas-favorites-change"));
    } catch {
      // Ignorar errores de almacenamiento
    }
  };

  const togglePetInAdoptionList = (petId: string) => {
    setOrderCompleted(false);
    setAdoptionList((prev) =>
      prev.includes(petId)
        ? prev.filter((id) => id !== petId)
        : [...prev, petId]
    );
  };

  const addKitToCart = (kitId: string) => {
    setOrderCompleted(false);
    setCartKits((prev) => ({
      ...prev,
      [kitId]: (prev[kitId] ?? 0) + 1,
    }));
  };

  const updateKitQuantity = (kitId: string, delta: number) => {
    setCartKits((prev) => {
      const nextQty = (prev[kitId] ?? 0) + delta;
      if (nextQty <= 0) {
        const copy = { ...prev };
        delete copy[kitId];
        return copy;
      }
      return { ...prev, [kitId]: nextQty };
    });
  };

  const setPetCardTab = (petId: string, tab: CardTab) => {
    setCardTabs((prev) => ({ ...prev, [petId]: tab }));
  };

  const allTraits = useMemo(() => {
    const set = new Set<string>();
    PETS.forEach((p) => p.traits.forEach((t) => set.add(t)));
    return Array.from(set);
  }, []);

  // Filtro auxiliar sin especie para actualizar contadores de pestañas
  const matchesNonSpeciesFilters = useMemo(() => {
    const normalizedQuery = normalizeText(search);
    const queryWords = normalizedQuery ? normalizedQuery.split(/\s+/) : [];

    return (pet: Pet) => {
      if (sizeFilter !== "todos" && pet.size !== sizeFilter) return false;
      if (genderFilter !== "todos" && pet.gender !== genderFilter) return false;
      if (onlyFavorites && !favorites.includes(pet.id)) return false;
      if (
        selectedTrait &&
        !pet.traits.some(
          (t) => normalizeText(t) === normalizeText(selectedTrait)
        )
      ) {
        return false;
      }

      if (queryWords.length > 0) {
        const searchableText = normalizeText(
          [
            pet.name,
            pet.breed,
            pet.species,
            pet.species === "perro" ? "perros canino" : "gatos felino",
            pet.gender,
            pet.size,
            pet.age,
            pet.description,
            pet.story,
            pet.idealHome.housing,
            pet.idealHome.summary,
            pet.health.routine,
            ...pet.traits,
          ].join(" ")
        );
        const allWordsMatch = queryWords.every((word) =>
          searchableText.includes(word)
        );
        if (!allWordsMatch) return false;
      }

      return true;
    };
  }, [search, sizeFilter, genderFilter, onlyFavorites, favorites, selectedTrait]);

  const filteredPets = useMemo(() => {
    const list = PETS.filter((pet) => {
      const matchesSpecies = filter === "todos" || pet.species === filter;
      return matchesSpecies && matchesNonSpeciesFilters(pet);
    });

    if (sortBy === "nombre") {
      return [...list].sort((a, b) => a.name.localeCompare(b.name, "es"));
    }
    if (sortBy === "edad-asc") {
      return [...list].sort((a, b) => a.ageMonths - b.ageMonths);
    }
    if (sortBy === "edad-desc") {
      return [...list].sort((a, b) => b.ageMonths - a.ageMonths);
    }
    if (sortBy === "aporte-asc") {
      return [...list].sort((a, b) => a.adoptionFee - b.adoptionFee);
    }
    return list;
  }, [filter, matchesNonSpeciesFilters, sortBy]);

  const counts = useMemo(() => {
    const matchingBase = PETS.filter(matchesNonSpeciesFilters);
    return {
      todos: matchingBase.length,
      perro: matchingBase.filter((p) => p.species === "perro").length,
      gato: matchingBase.filter((p) => p.species === "gato").length,
    };
  }, [matchesNonSpeciesFilters]);

  const filteredKits = useMemo(() => {
    if (kitCategory === "todos") return STARTER_KITS;
    return STARTER_KITS.filter((k) => k.category === kitCategory);
  }, [kitCategory]);

  // Totales del carrito / solicitud de adopción
  const totalKitItems = useMemo(
    () => Object.values(cartKits).reduce((acc, qty) => acc + qty, 0),
    [cartKits]
  );

  const totalDrawerCount = adoptionList.length + totalKitItems;

  const selectedAdoptionPets = useMemo(
    () => PETS.filter((p) => adoptionList.includes(p.id)),
    [adoptionList]
  );

  const totalContribution = useMemo(() => {
    const petsTotal = selectedAdoptionPets.reduce(
      (sum, p) => sum + p.adoptionFee,
      0
    );
    const kitsTotal = Object.entries(cartKits).reduce((sum, [kitId, qty]) => {
      const kit = STARTER_KITS.find((k) => k.id === kitId);
      return sum + (kit ? kit.price * qty : 0);
    }, 0);
    return petsTotal + kitsTotal;
  }, [selectedAdoptionPets, cartKits]);

  // Navegación con teclado en el modal o drawer
  useEffect(() => {
    if (!selectedPet && !isDrawerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedPet) setSelectedPetId(null);
        else if (isDrawerOpen) setIsDrawerOpen(false);
      } else if (
        selectedPet &&
        (e.key === "ArrowRight" || e.key === "ArrowLeft")
      ) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        const list = filteredPets.length > 0 ? filteredPets : PETS;
        const currentIndex = list.findIndex((p) => p.id === selectedPet.id);
        if (currentIndex === -1) return;
        const nextIndex =
          e.key === "ArrowRight"
            ? (currentIndex + 1) % list.length
            : (currentIndex - 1 + list.length) % list.length;
        setSelectedPetId(list[nextIndex].id);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPet, isDrawerOpen, filteredPets]);

  const hasActiveFilters =
    filter !== "todos" ||
    sizeFilter !== "todos" ||
    genderFilter !== "todos" ||
    search.trim() !== "" ||
    selectedTrait !== null ||
    onlyFavorites;

  const resetAllFilters = () => {
    setFilter("todos");
    setSizeFilter("todos");
    setGenderFilter("todos");
    setSortBy("destacados");
    setSearch("");
    setSelectedTrait(null);
    setOnlyFavorites(false);
  };

  const navigateModalPet = (direction: "prev" | "next") => {
    if (!selectedPet) return;
    const list = filteredPets.length > 0 ? filteredPets : PETS;
    const currentIndex = list.findIndex((p) => p.id === selectedPet.id);
    const baseIndex = currentIndex === -1 ? 0 : currentIndex;
    const nextIndex =
      direction === "next"
        ? (baseIndex + 1) % list.length
        : (baseIndex - 1 + list.length) % list.length;
    setSelectedPetId(list[nextIndex].id);
  };

  const handleAdoptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet || !applicantName.trim() || !applicantContact.trim()) {
      return;
    }
    setAdoptionSubmittedFor((prev) =>
      prev.includes(selectedPet.id) ? prev : [...prev, selectedPet.id]
    );
    if (!adoptionList.includes(selectedPet.id)) {
      setAdoptionList((prev) => [...prev, selectedPet.id]);
    }
  };

  const handleDrawerCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantContact.trim()) return;
    setAdoptionSubmittedFor((prev) => [
      ...new Set([...prev, ...adoptionList]),
    ]);
    setOrderCompleted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-stone-800">
      {/* Barra superior informativa estilo boutique de adopción */}
      <div className="border-b border-stone-800 bg-stone-950 px-4 py-2.5 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-stone-300">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-1">
          <span className="text-amber-200/90">
            ✦ Control veterinario y vacunas incluidas
          </span>
          <span className="hidden sm:inline text-stone-600">|</span>
          <span>Pañuelo y manta de apego gratis con cada adopción</span>
          <span className="hidden md:inline text-stone-600">|</span>
          <span className="hidden md:inline text-stone-400">
            Visitas: Lun a Sáb · 10:00 – 19:00 hrs
          </span>
        </div>
      </div>

      {/* Header de tienda de adopción */}
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[#faf9f6]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={resetAllFilters}
              className="flex items-center gap-3.5 text-left transition hover:opacity-80"
              title="Volver al inicio y mostrar todos"
            >
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/70 bg-gradient-to-br from-amber-50 to-stone-100 text-lg shadow-2xs"
              >
                🐾
              </span>
              <div>
                <span className="block font-serif text-lg sm:text-xl font-semibold uppercase tracking-[0.2em] text-stone-900">
                  Huellas Boutique
                </span>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.28em] text-amber-800/80">
                  Maison & Centro de Adopción
                </span>
              </div>
            </button>

            <nav
              aria-label="Navegación principal"
              className="hidden lg:flex items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500"
            >
              <a
                href="#inicio"
                className="text-stone-900 underline decoration-amber-500/70 decoration-2 underline-offset-8 transition hover:text-amber-900"
              >
                Home
              </a>
              <a
                href="#catalogo-mascotas"
                className="transition hover:text-stone-900"
              >
                Mascotas ({PETS.length})
              </a>
              <a
                href="#kits-bienvenida"
                className="transition hover:text-stone-900"
              >
                Boutique Kits
              </a>
              <a
                href="#proceso-adopcion"
                className="transition hover:text-stone-900"
              >
                Cómo Adoptar
              </a>
              <a
                href="#preguntas-frecuentes"
                className="transition hover:text-stone-900"
              >
                Preguntas
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botón de Favoritos */}
            <button
              type="button"
              onClick={() => setOnlyFavorites((prev) => !prev)}
              aria-pressed={onlyFavorites}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-all ${
                onlyFavorites
                  ? "border-rose-300 bg-rose-50 text-rose-700 shadow-2xs"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900"
              }`}
            >
              <span aria-hidden="true" className="text-sm">
                {onlyFavorites ? "♥" : "♡"}
              </span>
              <span className="hidden sm:inline">Favoritos</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] tracking-normal ${
                  onlyFavorites
                    ? "bg-rose-200/70 text-rose-800"
                    : "bg-stone-100 text-stone-700"
                }`}
              >
                {favorites.length}
              </span>
            </button>

            {/* Botón del Carrito / Solicitud de Adopción */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white shadow-2xs transition hover:bg-stone-800"
            >
              <span aria-hidden="true">🛍️</span>
              <span>Mi Adopción</span>
              <span className="rounded-full bg-amber-300 px-1.5 py-0.5 text-[10px] font-bold tracking-normal text-stone-900">
                {totalDrawerCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="mx-auto flex-1 w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Hero Banner Principal (HOME) con Tipografía Mayúscula y Elegante */}
        <section
          id="inicio"
          className="relative mb-14 overflow-hidden rounded-[2rem] border border-stone-200/90 bg-gradient-to-br from-white via-[#faf9f6] to-amber-50/60 p-6 sm:p-12 shadow-sm"
        >
          {/* Ornamento sutil de fondo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl"
          />
          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-amber-300/70 bg-amber-50/90 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-950 shadow-2xs">
                <span aria-hidden="true" className="text-amber-700">
                  ✦
                </span>
                <span>Colección de Adopción Responsable · 2026</span>
              </div>

              <h1 className="mt-6 font-serif text-3xl font-semibold uppercase leading-[1.12] tracking-[0.08em] text-stone-900 sm:text-5xl lg:text-[3.35rem]">
                El arte de dar un{" "}
                <span className="block text-amber-900/90">
                  hogar con elegancia
                </span>{" "}
                y corazón noble.
              </h1>

              <div className="mt-5 flex items-center gap-3">
                <span className="h-px w-12 bg-amber-700/40" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Perros & Gatos Seleccionados con Cuidado Veterinario
                </span>
              </div>

              <p className="mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-stone-600">
                Conoce la historia, salud y temperamento de cada compañero en
                nuestra galería curada. Agenda tu encuentro personalizado y
                prepara su llegada con nuestros kits de bienvenida solidarios.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <a
                  href="#catalogo-mascotas"
                  className="inline-flex items-center gap-2.5 rounded-full bg-stone-900 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-xs transition hover:bg-stone-800"
                >
                  <span>Explorar Mascotas</span>
                  <span aria-hidden="true">↓</span>
                </a>
                <a
                  href="#kits-bienvenida"
                  className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-stone-800 transition hover:border-stone-400 hover:bg-stone-50"
                >
                  <span>Kits de Bienvenida</span>
                </a>
              </div>

              {/* Métricas de confianza de la tienda en formato editorial mayúsculo */}
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-stone-200/80 pt-6">
                <div>
                  <span className="block font-serif text-2xl sm:text-3xl font-semibold uppercase tracking-[0.08em] text-stone-900">
                    100%
                  </span>
                  <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                    Salud & Vacunas al Día
                  </span>
                </div>
                <div>
                  <span className="block font-serif text-2xl sm:text-3xl font-semibold uppercase tracking-[0.08em] text-stone-900">
                    +240
                  </span>
                  <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                    Hogares Creados
                  </span>
                </div>
                <div>
                  <span className="block font-serif text-2xl sm:text-3xl font-semibold uppercase tracking-[0.08em] text-stone-900">
                    30 Días
                  </span>
                  <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                    Guía Post-Adopción
                  </span>
                </div>
              </div>
            </div>

            {/* Tarjeta destacada en el Hero */}
            <div className="lg:col-span-5">
              <div
                onClick={() => openPetDetail(PETS[0])}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openPetDetail(PETS[0]);
                  }
                }}
                className="group relative overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-4 sm:p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-400">
                    Retrato Destacado
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-800">
                    Nº 01 · Edición Semanal
                  </span>
                </div>
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-stone-100">
                  <Image
                    src={PETS[0].image}
                    alt={PETS[0].name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-stone-950/85 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200 backdrop-blur-xs">
                    ✦ Compañero de la Semana
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between px-1 pt-1">
                  <div>
                    <h2 className="font-serif text-xl font-semibold uppercase tracking-[0.12em] text-stone-900">
                      {PETS[0].name} · {PETS[0].breed}
                    </h2>
                    <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.16em] text-stone-500">
                      {PETS[0].age} · {PETS[0].traits.join(" · ")}
                    </p>
                  </div>
                  <span className="rounded-full border border-amber-300/80 bg-amber-50 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-950 transition group-hover:bg-amber-100">
                    Ver Perfil →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Catálogo de Mascotas */}
        <section id="catalogo-mascotas" className="scroll-mt-24 mb-16">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-stone-200/80 pb-5">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-amber-800">
                ✦ Galería Curada de Compañeros
              </span>
              <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl font-semibold uppercase tracking-[0.12em] text-stone-900">
                Nuestras Mascotas en Adopción
              </h2>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
              {filteredPets.length} de {PETS.length} Compañeros Disponibles
            </p>
          </div>

          {/* Barra de pestañas de cada mascota */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                Pestañas rápidas por mascota
              </p>
              <span className="text-[11px] uppercase tracking-[0.14em] text-stone-400">
                Haz clic en cualquiera para abrir su ficha
              </span>
            </div>
            <div
              role="tablist"
              aria-label="Pestañas de cada mascota"
              className="flex items-center gap-2 overflow-x-auto pb-2"
            >
              {PETS.map((pet) => {
                const isSelected = selectedPetId === pet.id;
                const isVisibleInGrid = filteredPets.some(
                  (p) => p.id === pet.id
                );
                return (
                  <button
                    key={pet.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => openPetDetail(pet)}
                    className={`group inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-all ${
                      isSelected
                        ? "border-stone-900 bg-stone-900 text-white shadow-xs"
                        : isVisibleInGrid
                        ? "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900"
                        : "border-stone-200/60 bg-stone-100/60 text-stone-400 hover:border-stone-300 hover:bg-white hover:text-stone-700"
                    }`}
                  >
                    <span aria-hidden="true">
                      {pet.species === "perro" ? "🐶" : "🐱"}
                    </span>
                    <span>{pet.name}</span>
                    <span
                      className={`text-[11px] ${
                        isSelected
                          ? "text-stone-300"
                          : "text-stone-400 group-hover:text-stone-500"
                      }`}
                    >
                      · {pet.breed.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel de Buscadores y Filtros de Tienda */}
          <div className="mb-8 rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-6 shadow-2xs">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Pestañas de Especie */}
              <div
                role="tablist"
                aria-label="Filtrar por especie"
                className="inline-flex flex-wrap self-start rounded-2xl border border-stone-200/90 bg-[#faf9f6] p-1"
              >
                {(
                  [
                    {
                      key: "todos",
                      label: "Todos",
                      icon: "🐾",
                      count: counts.todos,
                    },
                    {
                      key: "perro",
                      label: "Perros",
                      icon: "🐶",
                      count: counts.perro,
                    },
                    {
                      key: "gato",
                      label: "Gatos",
                      icon: "🐱",
                      count: counts.gato,
                    },
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
                          : "text-stone-600 hover:bg-stone-200/50 hover:text-stone-900"
                      }`}
                    >
                      <span aria-hidden="true">{tab.icon}</span>
                      <span>{tab.label}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-xs ${
                          active
                            ? "bg-stone-700 text-stone-100"
                            : "bg-stone-200/70 text-stone-600"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Buscador principal */}
              <div className="relative flex-1 lg:max-w-md">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nombre, raza, rasgo, tamaño o edad..."
                  aria-label="Buscar mascotas"
                  className="w-full rounded-2xl border border-stone-200 bg-[#faf9f6] py-2.5 pr-9 pl-10 text-sm text-stone-800 placeholder-stone-400 transition focus:border-stone-400 focus:bg-white focus:outline-none"
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
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Limpiar búsqueda"
                    className="absolute top-1/2 right-2.5 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-xs text-stone-400 hover:bg-stone-200/70 hover:text-stone-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Filtros secundarios */}
            <div className="mt-4 flex flex-col gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-[#faf9f6] px-3 py-1.5 text-xs text-stone-600">
                  <span className="font-medium text-stone-400">Tamaño:</span>
                  <select
                    value={sizeFilter}
                    onChange={(e) =>
                      setSizeFilter(e.target.value as "todos" | PetSize)
                    }
                    aria-label="Filtrar por tamaño"
                    className="cursor-pointer bg-transparent font-medium text-stone-800 focus:outline-none"
                  >
                    <option value="todos">Todos</option>
                    <option value="Pequeño">Pequeño</option>
                    <option value="Mediano">Mediano</option>
                    <option value="Grande">Grande</option>
                  </select>
                </label>

                <label className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-[#faf9f6] px-3 py-1.5 text-xs text-stone-600">
                  <span className="font-medium text-stone-400">Sexo:</span>
                  <select
                    value={genderFilter}
                    onChange={(e) =>
                      setGenderFilter(e.target.value as "todos" | PetGender)
                    }
                    aria-label="Filtrar por sexo"
                    className="cursor-pointer bg-transparent font-medium text-stone-800 focus:outline-none"
                  >
                    <option value="todos">Todos</option>
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                </label>

                <label className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-[#faf9f6] px-3 py-1.5 text-xs text-stone-600">
                  <span className="font-medium text-stone-400">Ordenar:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    aria-label="Ordenar mascotas"
                    className="cursor-pointer bg-transparent font-medium text-stone-800 focus:outline-none"
                  >
                    <option value="destacados">Destacados</option>
                    <option value="nombre">Nombre (A - Z)</option>
                    <option value="edad-asc">Edad (menor a mayor)</option>
                    <option value="edad-desc">Edad (mayor a menor)</option>
                    <option value="aporte-asc">Menor aporte solidario</option>
                  </select>
                </label>
              </div>

              <div className="flex items-center gap-3 text-xs text-stone-500">
                <span>
                  Mostrando{" "}
                  <strong className="font-semibold text-stone-800">
                    {filteredPets.length}
                  </strong>{" "}
                  de {PETS.length} compañeros
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 font-medium text-stone-700 transition hover:border-stone-300 hover:bg-stone-100"
                  >
                    Limpiar filtros ✕
                  </button>
                )}
              </div>
            </div>

            {/* Chips de temperamento */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-1">
              <span className="mr-1 text-[11px] font-medium text-stone-400">
                Temperamento:
              </span>
              {allTraits.map((trait) => {
                const active = selectedTrait === trait;
                return (
                  <button
                    key={trait}
                    type="button"
                    onClick={() =>
                      setSelectedTrait((prev) =>
                        prev === trait ? null : trait
                      )
                    }
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                      active
                        ? "bg-stone-800 text-white"
                        : "bg-stone-100/90 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900"
                    }`}
                  >
                    {trait}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid de tarjetas estilo tienda de adopción */}
          {filteredPets.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-200 bg-white/70 p-12 text-center">
              <p className="text-base font-medium text-stone-700">
                No encontramos compañeros con esos criterios de búsqueda.
              </p>
              <p className="mt-1 text-sm text-stone-500">
                Prueba limpiando el buscador o cambiando la categoría
                seleccionada.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-5 inline-flex items-center rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-700 shadow-2xs hover:border-stone-300 hover:bg-stone-50"
              >
                Restablecer todos los filtros
              </button>
            </div>
          ) : (
            <div
              aria-label="Listado de perros y gatos en adopción"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredPets.map((pet) => {
                const isFav = favorites.includes(pet.id);
                const activeCardTab: CardTab = cardTabs[pet.id] ?? "historia";
                const inAdoptionBag = adoptionList.includes(pet.id);
                const isAdopted = adoptionSubmittedFor.includes(pet.id);

                return (
                  <article
                    key={pet.id}
                    onClick={() => openPetDetail(pet)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openPetDetail(pet);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Ver ficha completa de ${pet.name}, ${pet.breed}`}
                    className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-md focus:ring-2 focus:ring-stone-400 focus:outline-none"
                  >
                    {/* Imagen con insignias */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                      <Image
                        src={pet.image}
                        alt={`${pet.name} - ${pet.breed}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-xs ${pet.accentColor}`}
                        >
                          <span aria-hidden="true">
                            {pet.species === "perro" ? "🐶" : "🐱"}
                          </span>
                          <span className="capitalize">{pet.species}</span>
                        </span>
                        {pet.badge && (
                          <span className="rounded-full bg-stone-900/80 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-xs">
                            {pet.badge}
                          </span>
                        )}
                        {isAdopted && (
                          <span className="rounded-full border border-emerald-200 bg-emerald-50/95 px-2.5 py-1 text-[11px] font-medium text-emerald-800">
                            ✓ Solicitud enviada
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(pet.id);
                        }}
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

                      {/* Etiqueta inferior de disponibilidad e inclusión */}
                      <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between rounded-2xl bg-white/90 px-3 py-1.5 text-xs backdrop-blur-md">
                        <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          Disponible para visita
                        </span>
                        <span className="font-semibold text-stone-800">
                          Aporte: ${pet.adoptionFee} USD
                        </span>
                      </div>
                    </div>

                    {/* Cuerpo de tarjeta */}
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <div className="flex items-baseline justify-between gap-2">
                          <h2 className="text-xl font-semibold tracking-tight text-stone-900 group-hover:text-stone-700">
                            {pet.name}
                          </h2>
                          <span className="text-xs font-medium text-stone-500">
                            {pet.age} · {pet.gender}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs font-medium text-stone-400">
                          {pet.breed} · {pet.size} ({pet.weight})
                        </p>

                        {/* Pestañas internas de cada mascota */}
                        <div
                          role="tablist"
                          aria-label={`Información de ${pet.name}`}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-3.5 inline-flex w-full rounded-xl border border-stone-200/80 bg-[#faf9f6] p-1"
                        >
                          {(
                            [
                              { key: "historia", label: "Historia" },
                              { key: "salud", label: "Salud" },
                              { key: "hogar", label: "Hogar" },
                            ] as const
                          ).map((tab) => {
                            const isTabActive = activeCardTab === tab.key;
                            return (
                              <button
                                key={tab.key}
                                type="button"
                                role="tab"
                                aria-selected={isTabActive}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPetCardTab(pet.id, tab.key);
                                }}
                                className={`flex-1 rounded-lg py-1 text-xs font-medium transition ${
                                  isTabActive
                                    ? "bg-white text-stone-900 shadow-2xs"
                                    : "text-stone-500 hover:text-stone-800"
                                }`}
                              >
                                {tab.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Contenido de la pestaña activa */}
                        <div className="mt-3 min-h-[4.5rem] text-sm leading-relaxed text-stone-600">
                          {activeCardTab === "historia" && (
                            <p>{pet.description}</p>
                          )}
                          {activeCardTab === "salud" && (
                            <div className="space-y-1.5 text-xs text-stone-600">
                              <div className="flex flex-wrap gap-1.5">
                                {pet.health.vaccinated && (
                                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                                    ✓ Vacunado
                                  </span>
                                )}
                                {pet.health.sterilized && (
                                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                                    ✓ Esterilizado
                                  </span>
                                )}
                                <span className="rounded-md bg-stone-100 px-2 py-0.5 font-medium text-stone-600">
                                  Energía: {pet.health.energyLevel}
                                </span>
                              </div>
                              <p className="text-stone-500">
                                {pet.health.routine}
                              </p>
                            </div>
                          )}
                          {activeCardTab === "hogar" && (
                            <div className="space-y-1 text-xs text-stone-600">
                              <p className="font-medium text-stone-700">
                                🏡 {pet.idealHome.housing}
                              </p>
                              <p className="text-stone-500">
                                {pet.idealHome.summary}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 border-t border-stone-100 pt-4">
                        <div className="flex flex-wrap gap-1.5">
                          {pet.traits.map((trait) => {
                            const isTraitSelected = selectedTrait === trait;
                            return (
                              <button
                                key={trait}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTrait((prev) =>
                                    prev === trait ? null : trait
                                  );
                                }}
                                title={`Filtrar por rasgo: ${trait}`}
                                className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                                  isTraitSelected
                                    ? "bg-stone-800 text-white"
                                    : "bg-stone-100/90 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900"
                                }`}
                              >
                                {trait}
                              </button>
                            );
                          })}
                        </div>

                        {/* Botones de acción de tienda */}
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openPetDetail(pet);
                            }}
                            className="flex-1 rounded-xl border border-stone-200 bg-[#faf9f6] py-2 text-xs font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-100"
                          >
                            Ver ficha
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePetInAdoptionList(pet.id);
                            }}
                            className={`flex-1 rounded-xl py-2 text-xs font-semibold transition ${
                              inAdoptionBag
                                ? "bg-emerald-700 text-white hover:bg-emerald-800"
                                : "bg-stone-900 text-white hover:bg-stone-800"
                            }`}
                          >
                            {inAdoptionBag
                              ? "✓ En mi solicitud"
                              : "+ Pre-adoptar"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Sección Tienda de Kits de Bienvenida y Esenciales */}
        <section
          id="kits-bienvenida"
          className="scroll-mt-24 mb-16 rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-10 shadow-2xs"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-900 border border-amber-200/70">
                🛍️ Boutique Solidaria
              </span>
              <h2 className="mt-3 font-serif text-2xl font-semibold uppercase tracking-[0.12em] text-stone-900 sm:text-3xl">
                Kits de Bienvenida & Esenciales
              </h2>
              <p className="mt-1.5 max-w-xl text-sm text-stone-600">
                Prepara tu hogar con artículos seleccionados por veterinarios. El
                100% de lo recaudado financia el refugio y alimento de nuevas
                mascotas.
              </p>
            </div>

            {/* Pestañas de categoría de kits */}
            <div
              role="tablist"
              aria-label="Filtrar kits de bienvenida"
              className="inline-flex self-start rounded-2xl border border-stone-200 bg-[#faf9f6] p-1"
            >
              {(
                [
                  { key: "todos", label: "Todos" },
                  { key: "perro", label: "Perros" },
                  { key: "gato", label: "Gatos" },
                  { key: "accesorios", label: "Descanso & Paseo" },
                ] as const
              ).map((tab) => {
                const active = kitCategory === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setKitCategory(tab.key)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "bg-stone-900 text-white"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredKits.map((kit) => {
              const qtyInCart = cartKits[kit.id] ?? 0;
              return (
                <div
                  key={kit.id}
                  className="flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-[#faf9f6]/60 p-5 transition hover:border-stone-300 hover:bg-white hover:shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-200 bg-white text-xl shadow-2xs">
                        {kit.icon}
                      </span>
                      <span className="rounded-full bg-stone-200/70 px-2.5 py-0.5 text-[11px] font-medium text-stone-700">
                        {kit.tag}
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-stone-900">
                      {kit.name}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-stone-600">
                      {kit.description}
                    </p>
                    <ul className="mt-3 space-y-1 border-t border-stone-200/60 pt-3 text-xs text-stone-500">
                      {kit.items.map((item) => (
                        <li key={item} className="flex items-start gap-1.5">
                          <span className="text-emerald-600">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-stone-200/60 pt-4">
                    <div>
                      <span className="block text-[10px] uppercase text-stone-400">
                        Aporte kit
                      </span>
                      <span className="text-base font-semibold text-stone-900">
                        ${kit.price} USD
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => addKitToCart(kit.id)}
                      className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                        qtyInCart > 0
                          ? "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
                          : "bg-stone-900 text-white hover:bg-stone-800"
                      }`}
                    >
                      {qtyInCart > 0
                        ? `En carrito (${qtyInCart}) +`
                        : "+ Agregar"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Sección Proceso de Adopción en 4 pasos */}
        <section id="proceso-adopcion" className="scroll-mt-24 mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="rounded-full border border-stone-200 bg-white px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500">
              Experiencia Guiada
            </span>
            <h2 className="mt-3 font-serif text-2xl font-semibold uppercase tracking-[0.12em] text-stone-900 sm:text-3xl">
              ¿Cómo Funciona Nuestra Boutique de Adopción?
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Un proceso transparente, cálido y acompañado por especialistas en
              bienestar animal.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Explora y pre-selecciona",
                desc: "Revisa las pestañas de cada mascota, filtra por estilo de vida y agrégala a tu solicitud.",
                icon: "🔍",
              },
              {
                step: "02",
                title: "Agenda tu encuentro",
                desc: "Elige entre una visita presencial en nuestra boutique o una videollamada personalizada.",
                icon: "📅",
              },
              {
                step: "03",
                title: "Prepara su llegada",
                desc: "Recibe asesoría sobre su rutina y, si deseas, suma un Kit de Bienvenida a tu solicitud.",
                icon: "🏡",
              },
              {
                step: "04",
                title: "Bienvenida a casa",
                desc: "Firmamos el compromiso de adopción responsable con carnet veterinario y seguimiento.",
                icon: "💛",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-500">
                    Paso {item.step}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-stone-900">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-stone-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de Preguntas Frecuentes (FAQ) */}
        <section
          id="preguntas-frecuentes"
          className="scroll-mt-24 mb-10 rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-10 shadow-2xs"
        >
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.26em] text-amber-800">
              ✦ Atención al Adoptante
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-semibold uppercase tracking-[0.12em] text-stone-900 text-center">
              Preguntas Frecuentes sobre la Adopción
            </h2>
            <div className="mt-6 divide-y divide-stone-200/70">
              {FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={faq.question} className="py-4">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaqIndex(isOpen ? null : index)
                      }
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between text-left text-sm font-semibold text-stone-800 hover:text-stone-900"
                    >
                      <span>{faq.question}</span>
                      <span className="ml-4 text-stone-400">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-stone-600">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Modal de Ficha Completa de Mascota */}
      {selectedPet && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pet-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-xs"
          onClick={closePetDetail}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-stone-200 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen de cabecera con botones anterior / siguiente */}
            <div className="relative aspect-[16/10] w-full bg-stone-100">
              <Image
                src={selectedPet.image}
                alt={selectedPet.name}
                fill
                sizes="(max-width: 640px) 100vw, 576px"
                className="object-cover"
              />

              <div className="absolute inset-y-0 left-3 flex items-center">
                <button
                  type="button"
                  onClick={() => navigateModalPet("prev")}
                  aria-label="Mascota anterior"
                  title="Mascota anterior (←)"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200/80 bg-white/90 text-sm text-stone-700 shadow-2xs backdrop-blur-xs transition hover:bg-white hover:text-stone-900"
                >
                  ←
                </button>
              </div>
              <div className="absolute inset-y-0 right-3 flex items-center">
                <button
                  type="button"
                  onClick={() => navigateModalPet("next")}
                  aria-label="Siguiente mascota"
                  title="Siguiente mascota (→)"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200/80 bg-white/90 text-sm text-stone-700 shadow-2xs backdrop-blur-xs transition hover:bg-white hover:text-stone-900"
                >
                  →
                </button>
              </div>

              <button
                type="button"
                onClick={closePetDetail}
                aria-label="Cerrar ventana"
                className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white/90 text-stone-700 shadow-2xs hover:bg-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${selectedPet.accentColor}`}
                    >
                      {selectedPet.species === "perro" ? "🐶 Perro" : "🐱 Gato"}
                    </span>
                    <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-700">
                      Aporte: ${selectedPet.adoptionFee} USD
                    </span>
                  </div>
                  <h3
                    id="pet-modal-title"
                    className="mt-2 text-2xl font-semibold text-stone-900"
                  >
                    {selectedPet.name}
                  </h3>
                  <p className="text-sm text-stone-500">
                    {selectedPet.breed} · {selectedPet.gender}
                  </p>
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

              {/* Pestañas dentro del modal de la mascota */}
              <div
                role="tablist"
                aria-label={`Secciones de la ficha de ${selectedPet.name}`}
                className="mt-6 flex rounded-2xl border border-stone-200/90 bg-[#faf9f6] p-1"
              >
                {(
                  [
                    { key: "resumen", label: "Resumen" },
                    { key: "salud", label: "Salud y Cuidados" },
                    { key: "hogar", label: "Hogar Ideal" },
                    { key: "adoptar", label: "Adoptar" },
                  ] as const
                ).map((tab) => {
                  const active = modalTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setModalTab(tab.key)}
                      className={`flex-1 rounded-xl px-2.5 py-2 text-xs font-medium transition ${
                        active
                          ? "bg-stone-900 text-white shadow-2xs"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Pestaña Resumen */}
              {modalTab === "resumen" && (
                <div className="mt-5">
                  <p className="text-sm leading-relaxed text-stone-600">
                    {selectedPet.story}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {selectedPet.traits.map((trait) => (
                      <span
                        key={trait}
                        className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl border border-stone-100 bg-stone-50 p-3.5 text-center">
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

                  {/* Qué incluye la adopción */}
                  <div className="mt-5 rounded-2xl border border-amber-200/60 bg-amber-50/40 p-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-900">
                      🎁 Su adopción incluye:
                    </h4>
                    <ul className="mt-2 grid grid-cols-1 gap-1.5 text-xs text-stone-700 sm:grid-cols-2">
                      {selectedPet.includedItems.map((item) => (
                        <li key={item} className="flex items-center gap-1.5">
                          <span className="text-emerald-600">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Pestaña Salud */}
              {modalTab === "salud" && (
                <div className="mt-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-2xl border border-stone-100 bg-stone-50 p-3 text-center">
                      <span className="block text-[11px] uppercase text-stone-400">
                        Vacunas
                      </span>
                      <span className="mt-1 block text-xs font-semibold text-emerald-700">
                        {selectedPet.health.vaccinated ? "Al día ✓" : "Pendiente"}
                      </span>
                    </div>
                    <div className="rounded-2xl border border-stone-100 bg-stone-50 p-3 text-center">
                      <span className="block text-[11px] uppercase text-stone-400">
                        Esterilizado
                      </span>
                      <span className="mt-1 block text-xs font-semibold text-emerald-700">
                        {selectedPet.health.sterilized ? "Sí ✓" : "No"}
                      </span>
                    </div>
                    <div className="rounded-2xl border border-stone-100 bg-stone-50 p-3 text-center">
                      <span className="block text-[11px] uppercase text-stone-400">
                        Microchip
                      </span>
                      <span className="mt-1 block text-xs font-semibold text-stone-700">
                        {selectedPet.health.microchip
                          ? "Registrado ✓"
                          : "En trámite"}
                      </span>
                    </div>
                    <div className="rounded-2xl border border-stone-100 bg-stone-50 p-3 text-center">
                      <span className="block text-[11px] uppercase text-stone-400">
                        Energía
                      </span>
                      <span className="mt-1 block text-xs font-semibold text-stone-800">
                        {selectedPet.health.energyLevel}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-stone-100 bg-[#faf9f6] p-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Rutina y cuidados recomendados
                    </h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
                      {selectedPet.health.routine}
                    </p>
                  </div>
                </div>
              )}

              {/* Pestaña Hogar Ideal */}
              {modalTab === "hogar" && (
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-stone-100 bg-[#faf9f6] p-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Espacio recomendado
                    </h4>
                    <p className="mt-1 text-sm font-medium text-stone-800">
                      🏡 {selectedPet.idealHome.housing}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                      {selectedPet.idealHome.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-stone-100 bg-stone-50 p-3.5">
                      <span className="block text-xs font-medium text-stone-500">
                        Convivencia con niños
                      </span>
                      <span className="mt-1 block text-sm font-semibold text-stone-800">
                        {selectedPet.idealHome.kidsFriendly
                          ? "✓ Muy recomendable"
                          : "Prefiere ambientes adultos"}
                      </span>
                    </div>
                    <div className="rounded-2xl border border-stone-100 bg-stone-50 p-3.5">
                      <span className="block text-xs font-medium text-stone-500">
                        Otros perros o gatos
                      </span>
                      <span className="mt-1 block text-sm font-semibold text-stone-800">
                        {selectedPet.idealHome.otherPetsFriendly
                          ? "✓ Sociable y compatible"
                          : "Prefiere ser hijo único"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Pestaña Adoptar */}
              {modalTab === "adoptar" && (
                <div className="mt-5">
                  {adoptionSubmittedFor.includes(selectedPet.id) ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-center">
                      <p className="text-sm font-semibold text-emerald-900">
                        ¡Solicitud registrada para conocer a {selectedPet.name}!
                      </p>
                      <p className="mt-1 text-xs text-emerald-700">
                        Hemos guardado a {selectedPet.name} en tu solicitud.
                        Nos pondremos en contacto contigo muy pronto.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleAdoptionSubmit} className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-stone-600">
                          Tu nombre completo
                        </label>
                        <input
                          type="text"
                          required
                          value={applicantName}
                          onChange={(e) => setApplicantName(e.target.value)}
                          placeholder="Ej. Camila Pérez"
                          className="mt-1 w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-3.5 py-2 text-sm text-stone-800 placeholder-stone-400 focus:border-stone-400 focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600">
                          Correo o teléfono de contacto
                        </label>
                        <input
                          type="text"
                          required
                          value={applicantContact}
                          onChange={(e) => setApplicantContact(e.target.value)}
                          placeholder="ejemplo@correo.com / +56 9..."
                          className="mt-1 w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-3.5 py-2 text-sm text-stone-800 placeholder-stone-400 focus:border-stone-400 focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600">
                          Cuéntanos brevemente sobre tu hogar (opcional)
                        </label>
                        <textarea
                          rows={2}
                          value={applicantMessage}
                          onChange={(e) => setApplicantMessage(e.target.value)}
                          placeholder={`Me gustaría conocer a ${selectedPet.name}...`}
                          className="mt-1 w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-3.5 py-2 text-sm text-stone-800 placeholder-stone-400 focus:border-stone-400 focus:bg-white focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full rounded-full bg-stone-900 py-2.5 text-xs font-semibold text-white transition hover:bg-stone-800"
                      >
                        Confirmar solicitud para {selectedPet.name}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Pie del modal */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-4">
                <div className="flex items-center gap-2">
                  {modalTab !== "adoptar" && (
                    <button
                      type="button"
                      onClick={() => setModalTab("adoptar")}
                      className="rounded-full bg-stone-900 px-5 py-2.5 text-xs font-medium text-white transition hover:bg-stone-800"
                    >
                      Solicitar adopción
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => togglePetInAdoptionList(selectedPet.id)}
                    className="rounded-full border border-stone-200 bg-[#faf9f6] px-4 py-2.5 text-xs font-medium text-stone-700 transition hover:bg-stone-100"
                  >
                    {adoptionList.includes(selectedPet.id)
                      ? "✓ En mi carrito de adopción"
                      : "+ Agregar a mi adopción"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={closePetDetail}
                  className="rounded-full border border-stone-200 bg-white px-5 py-2.5 text-xs font-medium text-stone-700 transition hover:bg-stone-50"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawer lateral: Carrito / Solicitud de Adopción y Kits */}
      {isDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Resumen de solicitud de adopción y kits"
          className="fixed inset-0 z-50 flex justify-end bg-stone-900/40 backdrop-blur-xs"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className="flex h-full w-full max-w-md flex-col justify-between bg-white p-6 shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">
                    Mi Solicitud & Boutique
                  </h3>
                  <p className="text-xs text-stone-500">
                    Mascotas pre-seleccionadas y kits de bienvenida
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  aria-label="Cerrar panel"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100"
                >
                  ✕
                </button>
              </div>

              {totalDrawerCount === 0 ? (
                <div className="py-12 text-center">
                  <span className="text-3xl">🐾</span>
                  <p className="mt-3 text-sm font-medium text-stone-700">
                    Tu solicitud está vacía
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    Agrega una mascota con el botón &ldquo;+ Pre-adoptar&rdquo; o
                    suma un Kit de Bienvenida para preparar su llegada.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-6">
                  {/* Mascotas en la solicitud */}
                  {selectedAdoptionPets.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                        Compañeros para conocer ({selectedAdoptionPets.length})
                      </h4>
                      <div className="mt-2.5 space-y-2.5">
                        {selectedAdoptionPets.map((pet) => (
                          <div
                            key={pet.id}
                            className="flex items-center justify-between rounded-2xl border border-stone-200/80 bg-[#faf9f6] p-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-stone-200">
                                <Image
                                  src={pet.image}
                                  alt={pet.name}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-stone-900">
                                  {pet.name}
                                </p>
                                <p className="text-xs text-stone-500">
                                  {pet.breed} · Aporte ${pet.adoptionFee} USD
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => togglePetInAdoptionList(pet.id)}
                              className="text-xs text-stone-400 hover:text-rose-600"
                              title="Quitar de la lista"
                            >
                              Quitar
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Kits en el carrito */}
                  {totalKitItems > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                        Kits y Esenciales ({totalKitItems})
                      </h4>
                      <div className="mt-2.5 space-y-2.5">
                        {Object.entries(cartKits).map(([kitId, qty]) => {
                          const kit = STARTER_KITS.find((k) => k.id === kitId);
                          if (!kit) return null;
                          return (
                            <div
                              key={kit.id}
                              className="flex items-center justify-between rounded-2xl border border-stone-200/80 bg-[#faf9f6] p-3"
                            >
                              <div>
                                <p className="text-sm font-medium text-stone-900">
                                  {kit.icon} {kit.name}
                                </p>
                                <p className="text-xs text-stone-500">
                                  ${kit.price} USD c/u
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateKitQuantity(kit.id, -1)}
                                  className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-200 bg-white text-xs text-stone-700"
                                >
                                  −
                                </button>
                                <span className="text-xs font-semibold">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateKitQuantity(kit.id, 1)}
                                  className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-200 bg-white text-xs text-stone-700"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Formulario de reserva de visita / pedido */}
                  {orderCompleted ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                      <p className="text-sm font-semibold text-emerald-900">
                        ✓ ¡Cita y solicitud reservada con éxito!
                      </p>
                      <p className="mt-1 text-xs text-emerald-700">
                        Te enviamos los detalles de tu encuentro ({visitMode}) y
                        el resumen de tu solicitud.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleDrawerCheckout}
                      className="space-y-3 border-t border-stone-200 pt-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                        Datos para agendar tu visita
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setVisitMode("presencial")}
                          className={`rounded-xl border py-2 text-xs font-medium transition ${
                            visitMode === "presencial"
                              ? "border-stone-900 bg-stone-900 text-white"
                              : "border-stone-200 bg-[#faf9f6] text-stone-600"
                          }`}
                        >
                          📍 Visita en tienda
                        </button>
                        <button
                          type="button"
                          onClick={() => setVisitMode("videollamada")}
                          className={`rounded-xl border py-2 text-xs font-medium transition ${
                            visitMode === "videollamada"
                              ? "border-stone-900 bg-stone-900 text-white"
                              : "border-stone-200 bg-[#faf9f6] text-stone-600"
                          }`}
                        >
                          💻 Videollamada
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="Tu nombre completo"
                        className="w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-3.5 py-2 text-xs text-stone-800 placeholder-stone-400 focus:border-stone-400 focus:bg-white focus:outline-none"
                      />
                      <input
                        type="text"
                        required
                        value={applicantContact}
                        onChange={(e) => setApplicantContact(e.target.value)}
                        placeholder="Teléfono o correo electrónico"
                        className="w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-3.5 py-2 text-xs text-stone-800 placeholder-stone-400 focus:border-stone-400 focus:bg-white focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="w-full rounded-full bg-stone-900 py-3 text-xs font-semibold text-white transition hover:bg-stone-800"
                      >
                        Confirmar solicitud (${totalContribution} USD)
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-stone-100 pt-4 flex items-center justify-between text-xs text-stone-500">
              <span>Total aporte solidario estimado:</span>
              <strong className="text-base font-semibold text-stone-900">
                ${totalContribution} USD
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Footer de Tienda de Adopción */}
      <footer className="border-t border-stone-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-sm">
                  🐾
                </span>
                <span className="text-sm font-semibold text-stone-900">
                  Huellas Boutique & Adopción
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-stone-500">
                Espacio dedicado al encuentro responsable entre perros, gatos y
                nuevas familias.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Horario y Ubicación
              </h4>
              <p className="mt-2 text-xs text-stone-500">
                Av. Las Flores 420, Espacio Jardín
              </p>
              <p className="mt-1 text-xs text-stone-500">
                Lunes a Sábado: 10:00 a 19:00 hrs
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Contacto directo
              </h4>
              <p className="mt-2 text-xs text-stone-500">
                adopciones@huellasboutique.org
              </p>
              <p className="mt-1 text-xs text-stone-500">
                Atención veterinaria y seguimiento incluido
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-stone-100 pt-6 flex flex-col items-center justify-between gap-2 text-xs text-stone-400 sm:flex-row">
            <p>© 2026 Huellas Boutique. Adopción responsable.</p>
            <p>Hecho con Next.js y Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
