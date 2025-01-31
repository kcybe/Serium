export async function importFromJson(file: File): Promise<any> {
    try {
      const text = await file.text()
      return JSON.parse(text)
    } catch (error) {
      throw new Error('Invalid JSON file')
    }
  }