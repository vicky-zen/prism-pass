import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs/promises";

const defaultCacheSec = 60 * 60;

export class CacheManagement<T> {
  private cache: T[] | null = null; // Cached data in memory
  private readonly filePath: string;

  constructor(private key: string, private dataFun: () => Promise<T[]>) {
    this.filePath = this.getFileName();

    setInterval(() => {
      this.storeFun();
    }, defaultCacheSec * 1000);
  }

  public async startFun(): Promise<void> {
    await this.storeFun();
  }

  private async storeFun() {
    try {
      const data = await this.dataFun();
      this.cache = data; // Store the fetched data in memory
      await fs.writeFile(this.filePath, JSON.stringify(data)); // Async write
    } catch (error) {
      console.error("Error storing data in cache:", error);
    }
  }

  private getFileName(): string {
    return `${dirname(fileURLToPath(import.meta.url))}/${this.key}.json`;
  }

  public async getAll() {
    if (this.cache !== null) {
      return this.cache; // Return from in-memory cache
    }

    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      this.cache = JSON.parse(data) as T[];
      return this.cache;
    } catch (error) {
      console.error("Error reading cache file:", error);
      return []; // Return empty array on error
    }
  }

  public async findOne(key: keyof T, value: unknown): Promise<T | undefined> {
    const list = await this.getAll();
    return list.find((data) => data[key] === value);
  }
}
