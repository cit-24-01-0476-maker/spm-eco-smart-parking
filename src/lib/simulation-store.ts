import { create } from "zustand";

export type SlotStatus = "available" | "reserved" | "occupied";
export type VehicleClass = "prebooked" | "staff" | "walkin" | "delivery" | "unauthorized";

export type CameraView = "cinematic" | "top" | "entrance" | "slot" | "dashboard" | "exit";

export interface Slot {
  id: number;
  x: number;
  z: number;
  status: SlotStatus;
  vehicleId?: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  color: string;
  klass: VehicleClass;
  /** 0..1 progress along its current path */
  progress: number;
  /** Logical state */
  state:
    | "queued"
    | "approachingEntry"
    | "scanning"
    | "verified"
    | "denied"
    | "drivingToSlot"
    | "parked"
    | "leavingSlot"
    | "approachingExit"
    | "exiting"
    | "left";
  slotId?: number;
  /** seconds elapsed parked */
  parkedFor: number;
  isRetail?: boolean;
  overstay?: boolean;
}

export type StoryStep =
  | "idle"
  | "problem"
  | "booking"
  | "arrival"
  | "classification"
  | "assignment"
  | "dashboard"
  | "pricing"
  | "payment"
  | "overstay"
  | "exit"
  | "overview";

export const STORY_SEQUENCE: StoryStep[] = [
  "problem",
  "booking",
  "arrival",
  "classification",
  "assignment",
  "dashboard",
  "pricing",
  "payment",
  "overstay",
  "exit",
  "overview",
];

export const STORY_CAPTIONS: Record<
  StoryStep,
  { title: string; body: string; camera: CameraView }
> = {
  idle: { title: "", body: "", camera: "cinematic" },
  problem: {
    title: "The Parking Problem",
    body: "Manual parking causes delays, congestion and revenue leakage in urban Sri Lanka.",
    camera: "top",
  },
  booking: {
    title: "Mobile Booking — SPM ECO",
    body: "Drivers browse nearby lots, pick a slot, and confirm with a QR ticket.",
    camera: "dashboard",
  },
  arrival: {
    title: "ANPR Gate Verification",
    body: "The entry camera scans the plate and matches it against the live booking record.",
    camera: "entrance",
  },
  classification: {
    title: "Vehicle Classification",
    body: "Pre-booked, staff, walk-in, delivery and unauthorized vehicles are handled automatically.",
    camera: "entrance",
  },
  assignment: {
    title: "Smart Slot Assignment",
    body: "Glowing guidance routes the driver to the nearest reserved slot.",
    camera: "slot",
  },
  dashboard: {
    title: "Live Operator Dashboard",
    body: "Slot occupancy, revenue and security alerts update in real time.",
    camera: "dashboard",
  },
  pricing: {
    title: "Dynamic Pricing Engine",
    body: "Duration, peak hours and overtime charges are calculated on the fly.",
    camera: "dashboard",
  },
  payment: {
    title: "Frictionless QR Payment",
    body: "The driver scans, pays and receives an exit token instantly.",
    camera: "dashboard",
  },
  overstay: {
    title: "Retail Overstay Detection",
    body: "Cars exceeding the free retail limit trigger an overstay fee before exit.",
    camera: "slot",
  },
  exit: {
    title: "Automated Exit",
    body: "ANPR confirms the plate, payment is verified, and the barrier opens.",
    camera: "exit",
  },
  overview: {
    title: "SPM ECO System",
    body: "Smart parking management — from booking to exit, in one connected platform.",
    camera: "top",
  },
};

const SLOT_COLS = 8;
const SLOT_ROWS = 3;
const SLOT_W = 3;
const SLOT_D = 5.5;

function initSlots(): Slot[] {
  const slots: Slot[] = [];
  let id = 0;
  for (let r = 0; r < SLOT_ROWS; r++) {
    for (let c = 0; c < SLOT_COLS; c++) {
      const x = (c - (SLOT_COLS - 1) / 2) * SLOT_W;
      const z = -8 + r * (SLOT_D + 1.5);
      slots.push({ id: id++, x, z, status: "available" });
    }
  }
  return slots;
}

const PLATES = [
  "CAR-2841",
  "WP-1207",
  "KY-9912",
  "CAB-3380",
  "SP-6671",
  "WP-7022",
  "GA-5519",
  "KL-4408",
];
const COLORS = ["#e0e6ef", "#1f2a44", "#3b6bd6", "#d33d3d", "#3a3a3a", "#c8a96a"];

interface State {
  step: StoryStep;
  playing: boolean;
  storyMode: boolean;
  presentationMode: boolean;
  cameraView: CameraView;
  slots: Slot[];
  vehicles: Vehicle[];
  entryGateOpen: boolean;
  exitGateOpen: boolean;
  scanActive: boolean;
  alert: string | null;
  dailyCount: number;
  revenue: number;
  paymentVisible: boolean;
  pricingVisible: boolean;
  bookingVisible: boolean;
  overstayActive: boolean;

  // actions
  setStep: (s: StoryStep) => void;
  nextStep: () => void;
  setCameraView: (c: CameraView) => void;
  setPlaying: (p: boolean) => void;
  reset: () => void;
  addVehicle: (klass?: VehicleClass) => void;
  triggerUnauthorized: () => void;
  triggerOverstay: () => void;
  startStory: () => void;
  startPresentation: () => void;
  stopPresentation: () => void;
  tick: (dt: number) => void;
}

let vehCounter = 0;
const newVehicle = (klass: VehicleClass): Vehicle => {
  vehCounter++;
  return {
    id: `v${vehCounter}`,
    plate: PLATES[vehCounter % PLATES.length] + "-" + vehCounter,
    color: COLORS[vehCounter % COLORS.length],
    klass,
    progress: 0,
    state: "approachingEntry",
    parkedFor: 0,
  };
};

export const useSim = create<State>((set, get) => ({
  step: "idle",
  playing: false,
  storyMode: false,
  presentationMode: false,
  cameraView: "cinematic",
  slots: initSlots(),
  vehicles: [],
  entryGateOpen: false,
  exitGateOpen: false,
  scanActive: false,
  alert: null,
  dailyCount: 0,
  revenue: 0,
  paymentVisible: false,
  pricingVisible: false,
  bookingVisible: false,
  overstayActive: false,

  setStep: (s) => set({ step: s, cameraView: STORY_CAPTIONS[s].camera }),
  nextStep: () => {
    const cur = get().step;
    const idx = STORY_SEQUENCE.indexOf(cur as StoryStep);
    const next = STORY_SEQUENCE[(idx + 1) % STORY_SEQUENCE.length];
    get().setStep(next);
  },
  setCameraView: (c) => set({ cameraView: c }),
  setPlaying: (p) => set({ playing: p }),
  reset: () => {
    vehCounter = 0;
    set({
      step: "idle",
      playing: false,
      storyMode: false,
      presentationMode: false,
      slots: initSlots(),
      vehicles: [],
      entryGateOpen: false,
      exitGateOpen: false,
      scanActive: false,
      alert: null,
      dailyCount: 0,
      revenue: 0,
      paymentVisible: false,
      pricingVisible: false,
      bookingVisible: false,
      overstayActive: false,
      cameraView: "cinematic",
    });
  },
  addVehicle: (klass = "prebooked") => {
    const v = newVehicle(klass);
    set((s) => ({ vehicles: [...s.vehicles, v], playing: true }));
  },
  triggerUnauthorized: () => {
    const v = newVehicle("unauthorized");
    set((s) => ({
      vehicles: [...s.vehicles, v],
      playing: true,
      alert: "Unauthorized vehicle detected at entry",
    }));
  },
  triggerOverstay: () => {
    set((s) => {
      const slots = [...s.slots];
      // mark a free slot reserved/occupied as retail overstay
      const freeSlot = slots.find((sl) => sl.status === "available");
      if (!freeSlot) return s;
      const v = newVehicle("walkin");
      v.isRetail = true;
      v.overstay = true;
      v.state = "parked";
      v.slotId = freeSlot.id;
      v.parkedFor = 9999;
      freeSlot.status = "occupied";
      freeSlot.vehicleId = v.id;
      return {
        ...s,
        vehicles: [...s.vehicles, v],
        slots,
        overstayActive: true,
        alert: "Overstay detected at retail slot",
      };
    });
  },
  startStory: () => {
    get().reset();
    set({ storyMode: true, playing: true });
    get().setStep("problem");
  },
  startPresentation: () => {
    get().reset();
    set({ presentationMode: true, storyMode: true, playing: true });
    get().setStep("problem");
  },
  stopPresentation: () => set({ presentationMode: false }),

  tick: (dt) => {
    // advance vehicles
    set((s) => {
      const slots = s.slots.map((x) => ({ ...x }));
      let revenue = s.revenue;
      let dailyCount = s.dailyCount;
      let alert = s.alert;
      let entryGateOpen = s.entryGateOpen;
      let exitGateOpen = s.exitGateOpen;
      let scanActive = s.scanActive;

      const vehicles = s.vehicles
        .map((v) => {
          const nv = { ...v };
          switch (nv.state) {
            case "approachingEntry": {
              nv.progress += dt * 0.35;
              if (nv.progress >= 1) {
                nv.state = "scanning";
                nv.progress = 0;
                scanActive = true;
              }
              break;
            }
            case "scanning": {
              nv.progress += dt * 0.6;
              if (nv.progress >= 1) {
                scanActive = false;
                if (nv.klass === "unauthorized") {
                  nv.state = "denied";
                  alert = `Unauthorized: ${nv.plate}`;
                } else {
                  nv.state = "verified";
                  entryGateOpen = true;
                  // assign slot
                  const free = slots.find((sl) => sl.status === "available");
                  if (free) {
                    free.status = "reserved";
                    free.vehicleId = nv.id;
                    nv.slotId = free.id;
                  }
                }
                nv.progress = 0;
              }
              break;
            }
            case "verified": {
              nv.progress += dt * 0.5;
              if (nv.progress >= 1) {
                nv.state = "drivingToSlot";
                nv.progress = 0;
                entryGateOpen = false;
              }
              break;
            }
            case "drivingToSlot": {
              nv.progress += dt * 0.35;
              if (nv.progress >= 1) {
                nv.state = "parked";
                nv.progress = 0;
                if (nv.slotId !== undefined) {
                  const sl = slots.find((x) => x.id === nv.slotId);
                  if (sl) sl.status = "occupied";
                }
                dailyCount += 1;
              }
              break;
            }
            case "parked": {
              nv.parkedFor += dt;
              if (nv.parkedFor > 14 && !nv.isRetail) {
                nv.state = "leavingSlot";
                nv.progress = 0;
              }
              break;
            }
            case "leavingSlot": {
              nv.progress += dt * 0.4;
              if (nv.progress >= 1) {
                nv.state = "approachingExit";
                nv.progress = 0;
                if (nv.slotId !== undefined) {
                  const sl = slots.find((x) => x.id === nv.slotId);
                  if (sl) {
                    sl.status = "available";
                    sl.vehicleId = undefined;
                  }
                }
                revenue += Math.round(150 + Math.random() * 250);
              }
              break;
            }
            case "approachingExit": {
              nv.progress += dt * 0.35;
              if (nv.progress >= 1) {
                nv.state = "exiting";
                nv.progress = 0;
                exitGateOpen = true;
              }
              break;
            }
            case "exiting": {
              nv.progress += dt * 0.5;
              if (nv.progress >= 1) {
                nv.state = "left";
                nv.progress = 0;
                exitGateOpen = false;
              }
              break;
            }
            case "denied": {
              nv.progress += dt * 0.2;
              if (nv.progress >= 1) {
                nv.state = "left";
              }
              break;
            }
          }
          return nv;
        })
        .filter((v) => (v.state !== "left" || v.parkedFor > 0 ? true : v.state !== "left"));

      // remove fully gone
      const cleaned = vehicles.filter((v) => v.state !== "left");

      return {
        ...s,
        vehicles: cleaned,
        slots,
        revenue,
        dailyCount,
        alert,
        entryGateOpen,
        exitGateOpen,
        scanActive,
      };
    });
  },
}));

export function slotById(slots: Slot[], id?: number) {
  if (id === undefined) return undefined;
  return slots.find((s) => s.id === id);
}

export function summary(slots: Slot[]) {
  let available = 0,
    occupied = 0,
    reserved = 0;
  for (const s of slots) {
    if (s.status === "available") available++;
    else if (s.status === "occupied") occupied++;
    else reserved++;
  }
  return { total: slots.length, available, occupied, reserved };
}
