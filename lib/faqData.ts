export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    id: 1,
    question: "How fast is delivery?",
    answer: "Most services are delivered within minutes to a few hours.",
  },
  {
    id: 2,
    question: "Is my account safe?",
    answer: "Yes. We never ask for passwords or sensitive information.",
  },
];
