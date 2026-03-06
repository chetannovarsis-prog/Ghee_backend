import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight } from "@medusajs/icons"
import { Container, Heading, Text, Badge, Table } from "@medusajs/ui"
import { useEffect, useState } from "react"

type ContactQuery = {
  id: string
  first_name: string
  last_name: string
  email: string
  subject: string
  message: string
  created_at: string
}

const ContactQueriesPage = () => {
  const [queries, setQueries] = useState<ContactQuery[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ContactQuery | null>(null)

  useEffect(() => {
    fetch("/admin/contact", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setQueries(data.contact_queries || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h1">Contact Queries</Heading>
          <Text className="text-ui-fg-subtle">
            Messages submitted from the storefront contact form
          </Text>
        </div>
        <Badge color="blue">{queries.length} total</Badge>
      </div>

      <Container className="divide-y p-0 overflow-hidden">
        {loading ? (
          <div className="px-6 py-8 text-center">
            <Text className="text-ui-fg-subtle">Loading...</Text>
          </div>
        ) : queries.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Text className="text-ui-fg-subtle">
              No contact queries yet. When customers submit the contact form,
              their messages will appear here.
            </Text>
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Subject</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Message</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {queries.map((q) => (
                <Table.Row key={q.id}>
                  <Table.Cell>
                    <Text className="font-medium">
                      {q.first_name} {q.last_name}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-ui-fg-subtle">{q.email}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{q.subject}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-ui-fg-subtle text-sm">
                      {new Date(q.created_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      onClick={() =>
                        setSelected(selected?.id === q.id ? null : q)
                      }
                      className="text-ui-fg-interactive hover:underline text-sm"
                    >
                      {selected?.id === q.id ? "Hide" : "View"}
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Container>

      {/* Message Preview Panel */}
      {selected && (
        <Container className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Heading level="h2" className="mb-1">
                {selected.subject}
              </Heading>
              <Text className="text-ui-fg-subtle">
                From:{" "}
                <span className="font-medium text-ui-fg-base">
                  {selected.first_name} {selected.last_name}
                </span>{" "}
                &lt;{selected.email}&gt;
              </Text>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-ui-fg-subtle hover:text-ui-fg-base text-xl leading-none"
            >
              ✕
            </button>
          </div>
          <div className="bg-ui-bg-subtle rounded-lg p-4 mt-2">
            <Text className="whitespace-pre-wrap text-ui-fg-base leading-relaxed">
              {selected.message}
            </Text>
          </div>
        </Container>
      )}
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Contact Queries",
  icon: ChatBubbleLeftRight,
})

export default ContactQueriesPage
