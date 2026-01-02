export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "What is Hampton Roads DevFest?",
    answer: "Hampton Roads DevFest is a curated, community-driven software development conference produced by RevolutionVA. It brings together developers, technical leaders, and decision-makers from across the Hampton Roads region for a full day of high-quality technical and professional content.",
  },
  {
    question: "Who should attend?",
    answer: "This event is designed for a broad technical audience—from junior developers through senior engineers, directors, and C-level leaders. Sessions are selected to be accessible, practical, and relevant across experience levels.",
  },
  {
    question: "What does my ticket include?",
    answer: "Your ticket includes full-day conference admission, lunch, and drink tickets (cash bar available for additional purchases).",
  },
];
