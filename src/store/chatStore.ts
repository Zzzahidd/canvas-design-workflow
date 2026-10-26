import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  toolUsed?: {
    name: string;
    version: string;
    details?: string;
  };
  attachment?: {
    id: string;
    name: string;
    type: 'pdf' | 'csv' | 'invoice' | 'document';
    meta: string;
    amount?: string;
  };
  learnedUpdate?: {
    skill: string;
    versionFrom: string;
    versionTo: string;
    rule: string;
  };
}

interface ChatState {
  messages: ChatMessage[];
  homePrompt: string;
  activeChatInput: string;
  isGenerating: boolean;
  selectedInvoice: {
    number: string;
    client: string;
    amount: string;
    hours: string;
    rate: string;
    poNumber: string;
    date: string;
  } | null;

  // Actions
  setHomePrompt: (val: string) => void;
  setActiveChatInput: (val: string) => void;
  sendMessageFromHome: (text: string) => void;
  sendActiveChatMessage: (text: string) => void;
  setSelectedInvoice: (inv: ChatState['selectedInvoice']) => void;
  resetChatToDefault: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'user',
    timestamp: '9:40 AM',
    text: 'Invoice Acme and Lumen Labs for October. Draft replies to each client in their usual tone. Ask me before sending.',
  },
  {
    id: 'msg-2',
    sender: 'assistant',
    timestamp: '9:42 AM',
    text: 'October has 142.5 tracked hours across both clients. Both draft invoices are attached (section 4) and the Lumen Labs SOW.\n\n· Acme Corp: 122.5h, $31,250.00, PO 4471-B added per learned rule\n· Lumen Labs: 20h, $5,200.00 at the SOW rate of $260/h',
    toolUsed: {
      name: 'Invoice clients from tracked hours',
      version: 'v23',
      details: 'Extracted 142.5 billable hours across Acme Corp (122.5h) and Lumen Labs (20h). Matched against active SOWs and verified PO 4471-B.',
    },
    attachment: {
      id: 'inv-1',
      name: 'Invoice-INV-2026-118',
      type: 'invoice',
      meta: 'Acme Corp, $31,250.00 · v2',
      amount: '$31,250.00',
    },
    learnedUpdate: {
      skill: 'Invoice skill',
      versionFrom: 'v23',
      versionTo: 'v24',
      rule: 'Acme needs a PO number on every invoice',
    },
  },
  {
    id: 'msg-3',
    sender: 'assistant',
    timestamp: '9:43 AM',
    text: "Both invoices are drafted in the billing portal and bound to their purchase orders. Nothing has been sent.\n\nThe Acme email references the PO and cc's Jonas as requested. The Lumen email is short and links the invoice instead of attaching it.",
  },
];

const STORAGE_KEY_CHAT = 'canvas_chat_messages_v1';

const getStoredMessages = (): ChatMessage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHAT);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    // ignore
  }
  return INITIAL_MESSAGES;
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: getStoredMessages(),
  homePrompt: '',
  activeChatInput: '',
  isGenerating: false,
  selectedInvoice: null,

  setHomePrompt: (val) => set({ homePrompt: val }),
  setActiveChatInput: (val) => set({ activeChatInput: val }),

  sendMessageFromHome: (text) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: 'Just now',
      text: text.trim(),
    };

    set((state) => {
      const updated = [...state.messages, userMsg];
      try {
        localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(updated));
      } catch (e) {}
      return {
        messages: updated,
        homePrompt: '',
        isGenerating: true,
      };
    });

    // Simulate intelligent streaming assistant response
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        timestamp: 'Just now',
        text: `I've analyzed your request: "${text.trim()}". Prepared drafts, verified associated skills, and staged all updates for your approval.`,
        toolUsed: {
          name: 'Task coordinator & skill matcher',
          version: 'v14',
          details: 'Matched 2 workflow triggers and staged drafts in background workspace.',
        },
      };

      set((state) => {
        const next = [...state.messages, assistantMsg];
        try {
          localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(next));
        } catch (e) {}
        return {
          messages: next,
          isGenerating: false,
        };
      });
    }, 900);
  },

  sendActiveChatMessage: (text) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: 'Just now',
      text: text.trim(),
    };

    set((state) => {
      const updated = [...state.messages, userMsg];
      try {
        localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(updated));
      } catch (e) {}
      return {
        messages: updated,
        activeChatInput: '',
        isGenerating: true,
      };
    });

    setTimeout(() => {
      let replyText = `Understood. Updated the review draft and verified against project guidelines.`;
      const lower = text.toLowerCase();
      if (lower.includes('send') || lower.includes('proceed') || lower.includes('approve')) {
        replyText = `Done. Sent the invoice draft to client contacts and logged delivery confirmations in your activity feed.`;
      } else if (lower.includes('loom') || lower.includes('link')) {
        replyText = `Generated a secure Loom recording link and inserted it directly into the Lumen draft body.`;
      } else if (lower.includes('po') || lower.includes('acme')) {
        replyText = `Confirmed PO 4471-B is attached to Acme Corp invoice and verified with billing portal.`;
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        timestamp: 'Just now',
        text: replyText,
        toolUsed: {
          name: 'Client email, enterprise',
          version: 'v38',
          details: 'Ran tone and compliance check. Staged delivery in queue.',
        },
      };

      set((state) => {
        const next = [...state.messages, assistantMsg];
        try {
          localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(next));
        } catch (e) {}
        return {
          messages: next,
          isGenerating: false,
        };
      });
    }, 850);
  },

  setSelectedInvoice: (inv) => set({ selectedInvoice: inv }),

  resetChatToDefault: () => {
    try {
      localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(INITIAL_MESSAGES));
    } catch (e) {}
    set({ messages: INITIAL_MESSAGES, isGenerating: false });
  },
}));
