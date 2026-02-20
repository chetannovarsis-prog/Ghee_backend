import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Button, Container, Heading, Text } from "@medusajs/ui"
import { useState } from "react"

const ProductWizardWidget = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    
    // Read file as base64 for simplicity in MVP
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64Content = (reader.result as string).split(',')[1]
      
      try {
        const response = await fetch("/admin/product-wizard/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename: file.name,
            fileContent: base64Content
          }),
        })

        const data = await response.json()
        setResult(data)
      } catch (error) {
        console.error("Upload failed", error)
      } finally {
        setLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <Container className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h2">Product Wizard</Heading>
          <Text className="text-ui-fg-subtle">Create products instantly from images.</Text>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            id="wizard-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={loading}
          />
          <Button 
            variant="secondary" 
            isLoading={loading}
            onClick={() => document.getElementById("wizard-upload")?.click()}
          >
            Create from Image
          </Button>
        </div>
      </div>

      {result && (
        <div className="mt-4 p-4 bg-ui-bg-subtle rounded-lg border border-ui-border-base">
          <Heading level="h3" className="mb-2">Discovered Details</Heading>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Text weight="plus" size="small">Title</Text>
              <Text>{result.details.title}</Text>
            </div>
            <div>
              <Text weight="plus" size="small">Price</Text>
              <Text>${result.details.price / 100}</Text>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="small">Use these details</Button>
            <Button variant="secondary" size="small" onClick={() => setResult(null)}>Cancel</Button>
          </div>
        </div>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.list.after",
})

export default ProductWizardWidget
