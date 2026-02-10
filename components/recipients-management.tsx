import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, Send } from "lucide-react"

export function RecipientsManagement() {
  const recipients = [
    {
      id: 1,
      name: "Alex Johnson",
      wallet: "0x1a2b3c4d5e6f7890",
      email: "alex@example.com",
      segments: ["New Users", "Developers"],
      campaigns: 2,
      totalRewards: "$125.50",
      lastActive: "2 hours ago",
      status: "active",
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Sarah Chen",
      wallet: "0x2b3c4d5e6f789012",
      email: "sarah@example.com",
      segments: ["Power Users"],
      campaigns: 3,
      totalRewards: "$340.00",
      lastActive: "1 day ago",
      status: "active",
      joinDate: "2023-12-08",
    },
    {
      id: 3,
      name: "Miguel Rodriguez",
      wallet: "0x3c4d5e6f78901234",
      email: "miguel@example.com",
      segments: ["Developers", "Power Users"],
      campaigns: 4,
      totalRewards: "$580.25",
      lastActive: "3 hours ago",
      status: "active",
      joinDate: "2023-11-22",
    },
    {
      id: 4,
      name: "Emma Wilson",
      wallet: "0x4d5e6f7890123456",
      email: "emma@example.com",
      segments: ["New Users"],
      campaigns: 1,
      totalRewards: "$50.00",
      lastActive: "5 days ago",
      status: "inactive",
      joinDate: "2024-02-01",
    },
    {
      id: 5,
      name: "David Kim",
      wallet: "0x5e6f789012345678",
      email: "david@example.com",
      segments: ["Inactive Users"],
      campaigns: 0,
      totalRewards: "$0.00",
      lastActive: "65 days ago",
      status: "inactive",
      joinDate: "2023-10-15",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recipients Overview</CardTitle>
        <CardDescription>Detailed view of all recipients (users/wallets) across your campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipient</TableHead>
              <TableHead>Wallet Address</TableHead>
              <TableHead>Segments</TableHead>
              <TableHead>Campaigns</TableHead>
              <TableHead>Total Rewards</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipients.map((recipient) => (
              <TableRow key={recipient.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`/placeholder.svg?height=32&width=32&query=user${recipient.id}`}
                        alt={recipient.name}
                      />
                      <AvatarFallback>
                        {recipient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{recipient.name}</div>
                      <div className="text-sm text-muted-foreground">{recipient.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{recipient.wallet.slice(0, 10)}...</code>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {recipient.segments.map((segment) => (
                      <Badge key={segment} variant="outline" className="text-xs">
                        {segment}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{recipient.campaigns}</TableCell>
                <TableCell className="font-medium">{recipient.totalRewards}</TableCell>
                <TableCell>{recipient.lastActive}</TableCell>
                <TableCell>
                  <Badge variant={recipient.status === "active" ? "default" : "secondary"}>{recipient.status}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Eye className="h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit Segments
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Send className="h-4 w-4" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-red-600">
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
