export interface PostMetadata {
  title: string;
  date: string; // Keep date for compatibility if needed, or remove if publishDate is the canonical date
  publishDate: string; // Added publishDate
  author: string;      // Added author
  tags: string[];
  slug: string;
  description: string;
}

declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}

	// 自訂的全域類型
	interface PostMetadata {
		title: string;
		date: string;
		tags: string[];
    description: string;
    publishDate: string;
    author: string;
	}

	interface Post {
		metadata: PostMetadata;
		slug: string;
	}
}