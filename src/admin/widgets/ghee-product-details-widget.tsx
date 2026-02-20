import { defineWidgetConfig } from "@medusajs/admin-sdk"
import {
  Button,
  Container,
  Heading,
  Input,
  Label,
  Select,
  Switch,
  Text,
  Toaster,
  toast,
} from "@medusajs/ui"
import { useState, useEffect } from "react"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"

const GheeProductDetailsWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  const isGheeProduct =
    data.title.toLowerCase().includes("ghee") ||
    data.categories?.some(cat => cat.name.toLowerCase().includes("ghee"))

  const [loading, setLoading] = useState(false)

  const [metadata, setMetadata] = useState({
    purity_percentage: data.metadata?.purity_percentage || "",
    cow_breed: data.metadata?.cow_breed || "Gir",
    processing_method: data.metadata?.processing_method || "Bilona",
    origin: data.metadata?.origin || "",
    packaging_type: data.metadata?.packaging_type || "Glass Jar",
    grass_fed: data.metadata?.grass_fed || false,
    organic_certified: data.metadata?.organic_certified || false,
    shelf_life_months: data.metadata?.shelf_life_months || "",
  })

  if (!isGheeProduct) {
    return null
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch("/admin/ghee-attributes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: data.id,
          metadata: {
            ...metadata,
            purity_percentage: metadata.purity_percentage ? parseFloat(String(metadata.purity_percentage)) : undefined,
            shelf_life_months: metadata.shelf_life_months ? parseInt(String(metadata.shelf_life_months)) : undefined,
          }
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save ghee attributes")
      }

      toast({
        title: "Success",
        description: "Ghee attributes saved successfully",
        variant: "success",
      })
    } catch (error) {
      console.error("Failed to save ghee attributes:", error)
      toast({
        title: "Error",
        description: "Failed to save ghee attributes",
        variant: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Ghee Product Details</Heading>
      </div>

      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Purity Percentage */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="purity" weight="plus">Purity Percentage (%)</Label>
            <Input
              id="purity"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={metadata.purity_percentage}
              onChange={(e) => setMetadata({ ...metadata, purity_percentage: e.target.value })}
              placeholder="e.g., 99.5"
            />
          </div>

          {/* Cow Breed */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="cow-breed" weight="plus">Cow Breed</Label>
            <Select
              value={metadata.cow_breed}
              onValueChange={(value) => setMetadata({ ...metadata, cow_breed: value })}
            >
              <Select.Trigger id="cow-breed">
                <Select.Value placeholder="Select breed" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="Gir">Gir</Select.Item>
                <Select.Item value="Sahiwal">Sahiwal</Select.Item>
                <Select.Item value="Red Sindhi">Red Sindhi</Select.Item>
                <Select.Item value="Buffalo">Buffalo</Select.Item>
                <Select.Item value="Mixed">Mixed</Select.Item>
                <Select.Item value="Other">Other</Select.Item>
              </Select.Content>
            </Select>
          </div>

          {/* Processing Method */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="processing" weight="plus">Processing Method</Label>
            <Select
              value={metadata.processing_method}
              onValueChange={(value) => setMetadata({ ...metadata, processing_method: value })}
            >
              <Select.Trigger id="processing">
                <Select.Value placeholder="Select method" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="Bilona">Bilona</Select.Item>
                <Select.Item value="Traditional">Traditional</Select.Item>
                <Select.Item value="Vedic">Vedic</Select.Item>
                <Select.Item value="Modern">Modern</Select.Item>
                <Select.Item value="Other">Other</Select.Item>
              </Select.Content>
            </Select>
          </div>

          {/* Packaging Type */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="packaging" weight="plus">Packaging Type</Label>
            <Select
              value={metadata.packaging_type}
              onValueChange={(value) => setMetadata({ ...metadata, packaging_type: value })}
            >
              <Select.Trigger id="packaging">
                <Select.Value placeholder="Select packaging" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="Glass Jar">Glass Jar</Select.Item>
                <Select.Item value="Pet Bottle">Pet Bottle</Select.Item>
                <Select.Item value="Tin">Tin</Select.Item>
                <Select.Item value="Other">Other</Select.Item>
              </Select.Content>
            </Select>
          </div>

          {/* Origin */}
          <div className="flex flex-col gap-2 col-span-2">
            <Label htmlFor="origin" weight="plus">Origin / Source</Label>
            <Input
              id="origin"
              type="text"
              value={metadata.origin}
              onChange={(e) => setMetadata({ ...metadata, origin: e.target.value })}
              placeholder="e.g., Gujarat, Rajasthan, or specific farm name"
            />
          </div>

          {/* Shelf Life */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="shelf-life" weight="plus">Shelf Life (Months)</Label>
            <Input
              id="shelf-life"
              type="number"
              min="0"
              value={metadata.shelf_life_months}
              onChange={(e) => setMetadata({ ...metadata, shelf_life_months: e.target.value })}
              placeholder="e.g., 12"
            />
          </div>

          {/* Grass Fed */}
          <div className="flex items-center gap-3 pt-6">
            <Switch
              id="grass-fed"
              checked={metadata.grass_fed}
              onCheckedChange={(checked) => setMetadata({ ...metadata, grass_fed: checked })}
            />
            <Label htmlFor="grass-fed" weight="plus">Grass Fed</Label>
          </div>

          {/* Organic Certified */}
          <div className="flex items-center gap-3 pt-6 col-span-2">
            <Switch
              id="organic"
              checked={metadata.organic_certified}
              onCheckedChange={(checked) => setMetadata({ ...metadata, organic_certified: checked })}
            />
            <Label htmlFor="organic" weight="plus">Organic Certified</Label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="primary"
            isLoading={loading}
            onClick={handleSave}
          >
            Save Ghee Attributes
          </Button>
        </div>
      </div>
      <Toaster />
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default GheeProductDetailsWidget
