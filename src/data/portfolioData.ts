export interface Project {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  nonTechBenefit: string;
  techDeepDive: string;
  tags: string[];
  image: string;
  metrics: string;
  demoUrl?: string;
  githubUrl?: string;
}

export interface SkillItem {
  name: string;
  description: string;
  tag?: string;
  iconName?: string;
}

export interface PortfolioData {
  personal: {
    name: string;
    role: string;
    city: string;
    availability: string;
    photoUrl: string;
    bioForEveryone: string;
    positioningNonTech: string;
    positioningTech: string;
  };
  socials: {
    platform: string;
    label: string;
    url: string;
    icon: string;
    handle: string;
    note?: string;
  }[];
  skillsNonTech: SkillItem[];
  skillsTech: {
    category: string;
    skills: string[];
  }[];
  projects: Project[];
}

export const portfolioData: PortfolioData = {
  personal: {
    name: "Tharun Reddy M",
    role: "AI Systems and Automation Builder",
    city: "Bengaluru, India",
    availability: "Available for freelance projects, AI integrations & high-impact client systems",
    photoUrl: "/images/tharun-photo.jpg",
    bioForEveryone: "I build websites, automations and AI systems for small businesses, developers and founders.",
    positioningNonTech: "I'm Tharun. I build portfolio websites, lead-capture systems, auto-reply systems and custom chatbots that turn your Instagram followers, WhatsApp inquiries and visitors into booked clients.",
    positioningTech: "I'm Tharun. I build agentic systems, LLM applications and RAG pipelines, and automate workflows with LangChain, CrewAI and n8n.",
  },
  socials: [
    {
      platform: "LinkedIn",
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/tharun-reddy-m-ai/",
      icon: "Linkedin",
      handle: "@tharun-reddy-m-ai",
      note: "Professional background, updates & network",
    },
    {
      platform: "GitHub",
      label: "GitHub",
      url: "https://github.com/tharunreddym-ai-dev",
      icon: "Github",
      handle: "@tharunreddym-ai-dev",
      note: "Open-source projects, agent code & pipelines",
    },
    {
      platform: "Instagram",
      label: "Instagram",
      url: "https://www.instagram.com/techh_nerdd/",
      icon: "Instagram",
      handle: "@techh_nerdd",
      note: "Quick questions & small business inquiries",
    },
    {
      platform: "YouTube",
      label: "YouTube",
      url: "https://www.youtube.com/@TharunWithAI",
      icon: "Youtube",
      handle: "@TharunWithAI",
      note: "Architecture walkthroughs & AI tutorials",
    },
  ],
  skillsNonTech: [
    {
      name: "Websites That Turn Visitors Into Paying Clients",
      description: "Clean, ultra-fast single-page websites tailored for makeup artists, tutors, bakers, boutique agencies, and consultants. Designed specifically to build instant trust and make contacting you effortless.",
      tag: "Lead Generation",
      iconName: "Globe",
    },
    {
      name: "Automated Lead Capture & Instant Telegram Alerts",
      description: "When an interested visitor fills your form, their contact details land directly in your Telegram or phone within 2 seconds. No more lost leads buried in spam folders.",
      tag: "Zero Missed Leads",
      iconName: "Zap",
    },
    {
      name: "24/7 Smart Business Chatbots",
      description: "Custom AI chat assistants that answer customer questions about your pricing, packages, availability, and services even while you are asleep or busy working.",
      tag: "24/7 Support",
      iconName: "Bot",
    },
    {
      name: "Zero-Hassle Workflow Automations",
      description: "Automate repetitive business chores: booking follow-ups, welcome emails, client onboarding, and invoice notifications without spending hours doing manual copy-pasting.",
      tag: "Save 10+ Hours/Week",
      iconName: "Cpu",
    },
  ],
  skillsTech: [
    {
      category: "Autonomous AI Agents & Orchestration",
      skills: ["LangChain", "CrewAI (Multi-Agent)", "Agentic Tool Calling", "ReAct Framework", "Long-Term Memory Patterns", "Structured Output Validation"],
    },
    {
      category: "RAG & Vector Retrieval",
      skills: ["Retrieval-Augmented Generation (RAG)", "Pinecone", "ChromaDB", "Vector Embeddings", "Context Window Compression", "Semantic Search"],
    },
    {
      category: "Backend & Systems Architecture",
      skills: ["Python 3.11+", "REST APIs", "Pandas", "NumPy", "Requests", "Git & GitHub", "SQLite"],
    },
    {
      category: "Workflow Automation & Data Pipelines",
      skills: ["n8n Workflow Engine", "Lead Capture Systems", "Pydantic Schema Enforcement", "Webhooks & Async Queues"],
    },
  ],
  projects: [
    {
      id: "project-1",
      title: "Agentic RAG System",
      subtitle: "MultiPDF Agentic Chat • Long-Term Memory per Set",
      badge: "Agentic RAG",
      nonTechBenefit: "Group your documents into a set and chat with an assistant that answers using exactly what's in those files, and remembers the conversation as you go.",
      techDeepDive: "Agentic RAG chatbot built with LangChain. Documents are grouped into sets, chunked, and embedded into a vector store, with chunk usage tracked per set, and each chat keeps its own long-term memory.",
      tags: ["LangChain", "Agentic RAG", "Vector DB", "PDF Parsing", "Long-Term Memory", "Python"],
      image: "/images/project-chat-websites.svg",
      metrics: "Chat with your own document sets, with memory",
      githubUrl: "https://github.com/",
      demoUrl: "#contact",
    },
    {
      id: "project-2",
      title: "Synthetic Dataset Generator",
      subtitle: "Natural Language → Schema → Synthetic Data",
      badge: "Python & Faker",
      nonTechBenefit: "Describe the kind of data you need in plain English and get a downloadable dataset for testing or learning, with no real customer data involved.",
      techDeepDive: "An LLM application where you describe the dataset you need in natural language. The LLM does not generate the data itself, only the schema. The actual rows are then generated in Python using the Faker library, so the output is synthetic data for testing and learning, not realistic real-world data.",
      tags: ["Python", "Faker Library", "LLM Schema Design", "Synthetic Data", "Automation"],
      image: "/images/project-dataset-generator.svg",
      metrics: "Plain-English request in, downloadable dataset out",
      githubUrl: "https://github.com/",
      demoUrl: "#contact",
    },
    {
      id: "project-3",
      title: "Agentic Chatbot with Long Term Memory",
      subtitle: "n8n • Long-Term Memory • Agentic Workflow",
      badge: "n8n & AI Agent",
      nonTechBenefit: "A customer assistant that never forgets past interactions. When a client returns weeks later, it remembers their previous preferences, past orders, and project context.",
      techDeepDive: "n8n agentic workflow with two kinds of memory: a short-term conversation window and a long-term store the agent can search.",
      tags: ["n8n", "Long-Term Memory", "Agentic Workflows"],
      image: "/images/project-agentic-chatbot.svg",
      metrics: "Remembers earlier conversations",
      githubUrl: "https://github.com/",
      demoUrl: "#contact",
    },
    {
      id: "project-4",
      title: "ToolDocs2MD",
      subtitle: "5-Agent Pipeline • Docs Link → Structured Markdown Textbook",
      badge: "CrewAI Multi-Agent",
      nonTechBenefit: "Give it the official documentation link for any tool or product, and it hands back a clear, organised handbook in Markdown, ready to read or publish.",
      techDeepDive: "Five agents work in sequence: a URL Validator checks the documentation link, an Architect plans the textbook's chapters, a Writer drafts each chapter, a Combiner merges every chapter into one document, and a Tester reviews the final result.",
      tags: ["CrewAI", "Multi-Agent Pipeline", "Documentation Parsing", "Markdown Generation", "Python"],
      image: "/images/project-confused-docs.svg",
      metrics: "Turns any documentation link into a structured handbook",
      githubUrl: "https://github.com/",
      demoUrl: "#contact",
    },
  ],
};
