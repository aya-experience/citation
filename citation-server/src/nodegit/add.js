export default async function add(path) {
	try {
		const index = await this.repository.refreshIndex();
		await index.addAll(path);
		await index.write();
		const oid = await index.writeTree();
		return oid;
	} catch (error) {
		console.error('NodeGit add error', error);
		throw error;
	}
}
