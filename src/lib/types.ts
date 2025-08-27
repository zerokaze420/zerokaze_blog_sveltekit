export interface PostMetadata {
  title: string;
  date: string;
  // 其他你需要的元数据字段
  slug: string;
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
	}

	interface Post {
		metadata: PostMetadata;
		slug: string;
	}
}