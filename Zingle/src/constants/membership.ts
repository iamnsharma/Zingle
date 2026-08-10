/** Sentinel meaning an unlimited count (e.g. unlimited likes on premium). */
export const UNLIMITED = -1;

export interface PlanGrants {
  /** Likes granted. `UNLIMITED` for premium plans. */
  likes: number;
  superLikes: number;
  boosts: number;
}

export interface MembershipPlan {
  id: string;
  title: string;
  priceLabel: string;
  benefit: string;
  gradient: [string, string];
  icon: string;
  grants: PlanGrants;
}

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'plus',
    title: 'Zingle Plus',
    priceLabel: '₹299/mo',
    benefit: 'Unlimited likes, Rewind & Passport',
    gradient: ['#FF4458', '#FF6B6B'],
    icon: 'heart-multiple',
    grants: { likes: UNLIMITED, superLikes: 5, boosts: 1 },
  },
  {
    id: 'gold',
    title: 'Zingle Gold',
    priceLabel: '₹599/mo',
    benefit: 'See who likes you & Top Picks',
    gradient: ['#FAB938', '#F5D061'],
    icon: 'star-four-points',
    grants: { likes: UNLIMITED, superLikes: 5, boosts: 5 },
  },
  {
    id: 'platinum',
    title: 'Zingle Platinum',
    priceLabel: '₹899/mo',
    benefit: 'Priority likes & Message before match',
    gradient: ['#9B59B6', '#BB8FCE'],
    icon: 'diamond-stone',
    grants: { likes: UNLIMITED, superLikes: 5, boosts: 10 },
  },
];

export const getPlanById = (id: string | null): MembershipPlan | undefined =>
  MEMBERSHIP_PLANS.find(plan => plan.id === id);

/** Starting inventory for a free (non-premium) account. */
export const DEFAULT_INVENTORY = {
  likes: 10,
  superLikes: 2,
  boosts: 0,
};

/** One-tap refill batch sizes for out-of-inventory quick top-ups. */
export const REFILL_BATCH = {
  likes: 10,
  superLikes: 5,
};

/**
 * @deprecated Use `useMembershipStore` for live inventory. Kept for defaults.
 */
export const MEMBERSHIP_INVENTORY = {
  superLikes: DEFAULT_INVENTORY.superLikes,
  boosts: DEFAULT_INVENTORY.boosts,
};

export const BOOST_GRADIENT: [string, string] = ['#8E2DE2', '#DA22FF'];

export interface BoostPackage {
  id: string;
  count: number;
  priceLabel: string;
  perLabel: string;
  tag?: string;
  popular?: boolean;
}

export const BOOST_PACKAGES: BoostPackage[] = [
  {
    id: 'boost-10',
    count: 10,
    priceLabel: '₹2,499',
    perLabel: '₹250 each',
    tag: 'Best value',
  },
  {
    id: 'boost-5',
    count: 5,
    priceLabel: '₹1,499',
    perLabel: '₹300 each',
    tag: 'Most popular',
    popular: true,
  },
  {
    id: 'boost-1',
    count: 1,
    priceLabel: '₹399',
    perLabel: '₹399 each',
  },
];

export const DISCOVERY_SETTINGS = [
  { id: 'location', icon: 'map-marker-outline', label: 'Location', value: 'New York, NY' },
  { id: 'age', icon: 'account-outline', label: 'Age range', value: '22 – 35' },
  { id: 'showMe', icon: 'gender-male-female', label: 'Show me', value: 'Women' },
] as const;
