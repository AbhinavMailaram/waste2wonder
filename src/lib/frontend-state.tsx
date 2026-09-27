import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS } from "@/lib/products";

export type ReferenceSource = "in-app" | "youtube";

export type ReferenceItem = {
  id: string;
  title: string;
  source: ReferenceSource;
  image: string;
  material: string;
  summary: string;
  time: string;
  cost: string;
  difficulty: "Easy" | "Medium" | "Hard";
  steps: string[];
  materials: string[];
  precautions: string[];
  youtubeUrl?: string;
  sourceCreator?: string;
  engagement: {
    likes: number;
    comments: number;
    views: number;
    implementations: number;
  };
};

export type ImplementedWork = {
  id: string;
  referenceId: string;
  title: string;
  finalImage: string;
  progressImages: string[];
  createdAt: string;
  fromContest?: boolean;
};

export type CreatedPost = {
  id: string;
  title: string;
  beforeImage: string;
  afterImage: string;
  processImages: string[];
  materials: string;
  cost: string;
  time: string;
  difficulty: "Easy" | "Medium" | "Hard";
  precautions: string;
  likes: number;
  comments: number;
  views: number;
  implementations: number;
};

type FrontendState = {
  references: ReferenceItem[];
  implementedWorks: ImplementedWork[];
  createdPosts: CreatedPost[];
  contest: { weekTitle: string; maxEntries: number; currentEntries: number };
  likeReference: (id: string) => void;
  bumpReferenceMetric: (id: string, metric: "comments" | "views") => void;
  registerImplementation: (input: {
    referenceId: string;
    title: string;
    finalImage: string;
    progressImages: string[];
    fromContest?: boolean;
  }) => void;
  createPost: (
    input: Omit<CreatedPost, "id" | "likes" | "comments" | "views" | "implementations">,
  ) => void;
};

const seedInApp = PRODUCTS.slice(0, 4).map<ReferenceItem>((p) => ({
  id: p.id,
  title: p.title,
  source: "in-app",
  image: p.image,
  material: p.material,
  summary: p.summary,
  time: p.time,
  cost: p.cost,
  difficulty: p.difficulty,
  steps: p.steps,
  materials: p.materialsList,
  precautions: p.safety,
  sourceCreator: "Waste2Wonder Creator",
  engagement: {
    likes: p.votes,
    comments: 24 + p.ideas,
    views: 500 + p.votes,
    implementations: Math.max(3, Math.floor(p.votes / 35)),
  },
}));

const seedYoutube: ReferenceItem[] = [
  {
    id: "yt-bottle-bird-feeder",
    title: "Bottle Bird Feeder",
    source: "youtube",
    image: "https://images.unsplash.com/photo-1492496913980-501348b61469?w=1200&q=80",
    material: "Plastic",
    summary: "Demo-mapped YouTube reference for an outdoor bird feeder using a bottle.",
    time: "22 min",
    cost: "$2",
    difficulty: "Easy",
    steps: [
      "Mock AI summary: Clean bottle and mark feeding holes.",
      "Mock AI summary: Cut holes, add perch sticks.",
      "Mock AI summary: Add hanging string and fill seeds.",
      "Mock AI summary: Place outdoors and test stability.",
    ],
    materials: ["1 plastic bottle", "2 wooden skewers", "string", "bird seeds"],
    precautions: ["Use a stable cutter and trim sharp edges."],
    youtubeUrl: "https://youtube.com/watch?v=demo-feed-001",
    engagement: { likes: 182, comments: 33, views: 1604, implementations: 9 },
  },
  {
    id: "yt-jar-wall-planter",
    title: "Jar Wall Planter",
    source: "youtube",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200&q=80",
    material: "Glass",
    summary: "Demo-mapped YouTube reference for a vertical wall planter from jars.",
    time: "35 min",
    cost: "$4",
    difficulty: "Medium",
    steps: [
      "Mock AI summary: Prepare backing board and clamp points.",
      "Mock AI summary: Secure jars with metal clamps.",
      "Mock AI summary: Add pebbles, soil, and low-water plants.",
      "Mock AI summary: Mount board and check load distribution.",
    ],
    materials: ["3 glass jars", "wooden board", "metal clamps", "screws"],
    precautions: ["Wear safety glasses while drilling."],
    youtubeUrl: "https://youtube.com/watch?v=demo-jar-plant-002",
    engagement: { likes: 240, comments: 48, views: 2440, implementations: 14 },
  },
];

const seedReferences = [...seedInApp, ...seedYoutube];

const seedImplemented: ImplementedWork[] = [
  {
    id: "impl-1",
    referenceId: "bottle-planter",
    title: "Kitchen Herb Bottle Planter",
    finalImage: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&q=80",
    progressImages: ["https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1200&q=80"],
    createdAt: new Date().toISOString(),
  },
];

const seedPosts: CreatedPost[] = [
  {
    id: "post-1",
    title: "Denim Pocket Organizer",
    beforeImage: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4b?w=1200&q=80",
    afterImage: "https://images.unsplash.com/photo-1517148815978-75f6acaaf32c?w=1200&q=80",
    processImages: [
      "https://images.unsplash.com/photo-1616628182509-6f0a4cb8a76d?w=1200&q=80",
      "https://images.unsplash.com/photo-1616628188540-8dbbf13f7434?w=1200&q=80",
    ],
    materials: "Old jeans, cardboard backing, thread, hooks",
    cost: "$3",
    time: "40 min",
    difficulty: "Medium",
    precautions: "Keep fingers away from needle path and use blunt clips for holding seams.",
    likes: 64,
    comments: 12,
    views: 520,
    implementations: 6,
  },
];

const FrontendCtx = createContext<FrontendState | null>(null);

export function FrontendStateProvider({ children }: { children: ReactNode }) {
  const [references, setReferences] = useState<ReferenceItem[]>(seedReferences);
  const [implementedWorks, setImplementedWorks] = useState<ImplementedWork[]>(seedImplemented);
  const [createdPosts, setCreatedPosts] = useState<CreatedPost[]>(seedPosts);
  const [contest, setContest] = useState({
    weekTitle: "Weekly EcoCraft Challenge",
    maxEntries: 100,
    currentEntries: 72,
  });

  const likeReference = (id: string) => {
    setReferences((prev) =>
      prev.map((ref) =>
        ref.id === id
          ? { ...ref, engagement: { ...ref.engagement, likes: ref.engagement.likes + 1 } }
          : ref,
      ),
    );
  };

  const bumpReferenceMetric = (id: string, metric: "comments" | "views") => {
    setReferences((prev) =>
      prev.map((ref) =>
        ref.id === id
          ? { ...ref, engagement: { ...ref.engagement, [metric]: ref.engagement[metric] + 1 } }
          : ref,
      ),
    );
  };

  const registerImplementation: FrontendState["registerImplementation"] = ({
    referenceId,
    title,
    finalImage,
    progressImages,
    fromContest,
  }) => {
    setImplementedWorks((prev) => [
      {
        id: crypto.randomUUID(),
        referenceId,
        title,
        finalImage,
        progressImages,
        createdAt: new Date().toISOString(),
        fromContest,
      },
      ...prev,
    ]);

    setReferences((prev) =>
      prev.map((ref) =>
        ref.id === referenceId
          ? {
              ...ref,
              engagement: {
                ...ref.engagement,
                implementations: ref.engagement.implementations + 1,
              },
            }
          : ref,
      ),
    );

    if (fromContest) {
      setContest((prev) => ({
        ...prev,
        currentEntries: Math.min(prev.maxEntries, prev.currentEntries + 1),
      }));
    }
  };

  const createPost: FrontendState["createPost"] = (input) => {
    setCreatedPosts((prev) => [
      {
        ...input,
        id: crypto.randomUUID(),
        likes: 0,
        comments: 0,
        views: 1,
        implementations: 0,
      },
      ...prev,
    ]);
  };

  const value = useMemo(
    () => ({
      references,
      implementedWorks,
      createdPosts,
      contest,
      likeReference,
      bumpReferenceMetric,
      registerImplementation,
      createPost,
    }),
    [references, implementedWorks, createdPosts, contest],
  );

  return <FrontendCtx.Provider value={value}>{children}</FrontendCtx.Provider>;
}

export function useFrontendState() {
  const ctx = useContext(FrontendCtx);
  if (!ctx) throw new Error("useFrontendState must be used inside FrontendStateProvider");
  return ctx;
}
