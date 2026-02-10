"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Edit, Trash2, MoreHorizontal, UserPlus, Users } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SegmentRecipient {
  id: string
  wallet: string
  allocation: number
  dateAdded: string
  status: "active" | "inactive"
  campaigns: number
  totalRewards: number
}

interface AudienceMemberManagementProps {
  audienceId?: string
  audienceName?: string
}

export function AudienceMemberManagement({ audienceId, audienceName }: AudienceMemberManagementProps) {
  const [recipients, setRecipients] = useState<SegmentRecipient[]>([
    {
      id: "1",
      wallet: "0x1234567890123456789012345678901234567890",
      allocation: 100,
      dateAdded: "2024-01-15",
      status: "active",
      campaigns: 3,
      totalRewards: 250,
    },
    {
      id: "2",
      wallet: "0x2345678901234567890123456789012345678901",
      allocation: 150,
      dateAdded: "2024-01-20",
      status: "active",
      campaigns: 2,
      totalRewards: 180,
    },
    {
      id: "3",
      wallet: "0x3456789012345678901234567890123456789012",
      allocation: 75,
      dateAdded: "2024-01-25",
      status: "inactive",
      campaigns: 1,
      totalRewards: 50,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingRecipient, setEditingRecipient] = useState<SegmentRecipient | null>(null)
  const [newRecipient, setNewRecipient] = useState({ wallet: "", allocation: 0 })

  const filteredRecipients = recipients.filter((recipient) =>
    recipient.wallet.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const validateWallet = (wallet: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(wallet)
  }

  const handleAddRecipient = () => {
    if (!validateWallet(newRecipient.wallet)) {
      return
    }

    const recipientExists = recipients.some((m) => m.wallet.toLowerCase() === newRecipient.wallet.toLowerCase())
    if (recipientExists) {
      return
    }

    const newRecipientData: SegmentRecipient = {
      id: Date.now().toString(),
      wallet: newRecipient.wallet,
      allocation: newRecipient.allocation,
      dateAdded: new Date().toISOString().split("T")[0],
      status: "active",
      campaigns: 0,
      totalRewards: 0,
    }

    setRecipients([...recipients, newRecipientData])
    setNewRecipient({ wallet: "", allocation: 0 })
    setIsAddDialogOpen(false)
  }

  const handleEditRecipient = () => {
    if (!editingRecipient) return

    setRecipients(
      recipients.map((m) => (m.id === editingRecipient.id ? { ...m, allocation: editingRecipient.allocation } : m)),
    )
    setIsEditDialogOpen(false)
    setEditingRecipient(null)
  }

  const handleRemoveRecipient = (recipientId: string) => {
    setRecipients(recipients.filter((m) => m.id !== recipientId))
  }

  const openEditDialog = (recipient: SegmentRecipient) => {
    setEditingRecipient({ ...recipient })
    setIsEditDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Audience Members
          {audienceName && <Badge variant="outline">{audienceName}</Badge>}
        </CardTitle>
        <CardDescription>
          Manage individual members (users/wallets) within this audience and their allocations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Add */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search wallet addresses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Member to Audience</DialogTitle>
                <DialogDescription>Add a new wallet address to this audience</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="wallet">Wallet Address</Label>
                  <Input
                    id="wallet"
                    placeholder="0x..."
                    value={newRecipient.wallet}
                    onChange={(e) => setNewRecipient({ ...newRecipient, wallet: e.target.value })}
                  />
                  {newRecipient.wallet && !validateWallet(newRecipient.wallet) && (
                    <Alert className="mt-2">
                      <AlertDescription>Please enter a valid Ethereum wallet address</AlertDescription>
                    </Alert>
                  )}
                </div>
                <div>
                  <Label htmlFor="allocation">Allocation</Label>
                  <Input
                    id="allocation"
                    type="number"
                    placeholder="100"
                    value={newRecipient.allocation || ""}
                    onChange={(e) => setNewRecipient({ ...newRecipient, allocation: Number(e.target.value) })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddRecipient}
                  disabled={!validateWallet(newRecipient.wallet) || newRecipient.allocation <= 0}
                >
                  Add Member
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Recipients Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Wallet Address</TableHead>
                <TableHead>Allocation</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Campaigns</TableHead>
                <TableHead>Total Rewards</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecipients.map((recipient) => (
                <TableRow key={recipient.id}>
                  <TableCell className="font-mono text-sm">
                    {recipient.wallet.slice(0, 10)}...{recipient.wallet.slice(-8)}
                  </TableCell>
                  <TableCell className="font-medium">{recipient.allocation}</TableCell>
                  <TableCell>{recipient.dateAdded}</TableCell>
                  <TableCell>
                    <Badge variant={recipient.status === "active" ? "default" : "secondary"}>{recipient.status}</Badge>
                  </TableCell>
                  <TableCell>{recipient.campaigns}</TableCell>
                  <TableCell>{recipient.totalRewards}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(recipient)} className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit Allocation
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRemoveRecipient(recipient.id)}
                          className="gap-2 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Member Allocation</DialogTitle>
              <DialogDescription>Update the allocation for this wallet address</DialogDescription>
            </DialogHeader>
            {editingRecipient && (
              <div className="space-y-4">
                <div>
                  <Label>Wallet Address</Label>
                  <Input value={editingRecipient.wallet} disabled className="font-mono" />
                </div>
                <div>
                  <Label htmlFor="edit-allocation">Allocation</Label>
                  <Input
                    id="edit-allocation"
                    type="number"
                    value={editingRecipient.allocation}
                    onChange={(e) =>
                      setEditingRecipient({
                        ...editingRecipient,
                        allocation: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditRecipient}>Update Allocation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Total members: {filteredRecipients.length}</span>
          <span>Total allocation: {filteredRecipients.reduce((sum, m) => sum + m.allocation, 0)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
