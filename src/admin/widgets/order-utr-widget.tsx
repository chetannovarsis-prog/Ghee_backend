import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { DetailWidgetProps, AdminOrder } from "@medusajs/framework/types"

const OrderUtrWidget = ({ data }: DetailWidgetProps<AdminOrder>) => {
    const payment = data.payment_collections?.[0]?.payments?.[0]
    const isManual =
        payment?.provider_id === "pp_manual_manual" ||
        payment?.provider_id?.includes("manual")

    if (!isManual) return null

    const utr = (data.metadata as any)?.utr_number as string | undefined
    const isCaptured = !!(payment?.captured_at)
    const submittedAt = (data.metadata as any)?.metadata_updated_at as string | undefined

    return (
        <Container className="divide-y p-0">
            <div className="flex items-center justify-between px-6 py-4">
                <Heading level="h2">Payment Reference (UTR)</Heading>
                {isCaptured ? (
                    <Badge color="green">Payment Captured</Badge>
                ) : (
                    <Badge color="orange">Pending Capture</Badge>
                )}
            </div>

            <div className="px-6 py-5">
                {utr ? (
                    <div className="flex flex-col gap-y-3">
                        {/* UTR Number */}
                        <div className="flex flex-col gap-y-1">
                            <Text className="text-xs text-ui-fg-subtle font-medium uppercase tracking-wide">
                                UTR / Transaction Reference
                            </Text>
                            <Text className="font-mono text-lg font-semibold text-ui-fg-base">
                                {utr}
                            </Text>
                        </div>

                        {/* Submission time */}
                        {submittedAt && (
                            <div className="flex flex-col gap-y-0.5">
                                <Text className="text-xs text-ui-fg-subtle font-medium uppercase tracking-wide">
                                    Submitted At
                                </Text>
                                <Text className="text-sm text-ui-fg-subtle">
                                    {new Date(submittedAt).toLocaleString("en-IN", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })}
                                </Text>
                            </div>
                        )}

                        {/* Capture status message */}
                        {isCaptured ? (
                            <div className="mt-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                                <Text className="text-green-700 text-sm font-medium">
                                    ✓ Payment has been captured. Customer has been notified.
                                </Text>
                            </div>
                        ) : (
                            <div className="mt-2 px-4 py-3 bg-orange-50 border border-orange-200 rounded-lg">
                                <Text className="text-orange-700 text-sm font-medium">
                                    ⏳ Verify the UTR above and then click "Capture payment" to confirm.
                                </Text>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <Text className="text-ui-fg-subtle text-sm">
                            No UTR submitted yet. The customer has not provided a payment reference number.
                        </Text>
                    </div>
                )}
            </div>
        </Container>
    )
}

export const config = defineWidgetConfig({
    zone: "order.details.after",
})

export default OrderUtrWidget
