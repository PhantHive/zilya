import fetch from 'node-fetch';

interface TenorGif {
	media_formats: {
		gif: {
			url: string;
		};
	};
}

interface TenorApiResponse {
	results: TenorGif[];
}

const tenorApiSearcher = async (query: string): Promise<string | null> => {
	const searcher = `https://g.tenor.com/v2/search?q=${encodeURIComponent(query)}&key=${
		process.env.TENOR_API
	}&limit=20`;

	try {
		const response = await fetch(searcher);
		if (!response.ok) {
			console.error(`Failed to fetch from Tenor API: ${response.statusText}`);
			return null;
		}

		const json = (await response.json()) as TenorApiResponse;

		if (json.results.length === 0) {
			console.error('No results found from Tenor API');
			return null;
		}

		const index = Math.floor(Math.random() * json.results.length);
		const gifUrl = json.results[index]?.media_formats.gif.url;
		if (!gifUrl) {
			console.error('No gif url found from Tenor API');
			return null;
		}

		return gifUrl;
	} catch (error) {
		console.error(`Error while fetching from Tenor API: ${error}`);
		return null;
	}
};

export { tenorApiSearcher };
