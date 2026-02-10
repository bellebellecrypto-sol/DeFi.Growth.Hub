"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, FileText, CheckCircle, AlertTriangle, X, Download } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface CSVPreviewData {
  totalWallets: number
  validWallets: number
  invalidWallets: number
  duplicateWallets: number
  previewData: Array<{
    wallet: string
    allocation: number
    status: "valid" | "invalid" | "duplicate"
    error?: string
  }>
}

interface CSVUploadPreviewProps {
  onImport: (data: CSVPreviewData) => void
  onCancel: () => void
}

export function CSVUploadPreview({ onImport, onCancel }: CSVUploadPreviewProps) {
  const [previewData, setPreviewData] = useState<CSVPreviewData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const validateWallet = (wallet: string): boolean => {
    // Basic Ethereum address validation
    return /^0x[a-fA-F0-9]{40}$/.test(wallet)
  }

  const processCSV = useCallback((file: File) => {
    setIsProcessing(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split("\n").filter((line) => line.trim())
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

      const walletIndex = headers.findIndex((h) => h.includes("wallet") || h.includes("address"))
      const allocationIndex = headers.findIndex((h) => h.includes("allocation") || h.includes("amount"))

      const processedData: CSVPreviewData["previewData"] = []
      const seenWallets = new Set<string>()
      let validCount = 0
      let invalidCount = 0
      let duplicateCount = 0

      for (let i = 1; i < Math.min(lines.length, 101); i++) {
        // Process max 100 rows for preview
        const columns = lines[i].split(",").map((c) => c.trim())
        const wallet = columns[walletIndex] || ""
        const allocation = Number.parseFloat(columns[allocationIndex] || "0")

        let status: "valid" | "invalid" | "duplicate" = "valid"
        let error: string | undefined

        if (!validateWallet(wallet)) {
          status = "invalid"
          error = "Invalid wallet address format"
          invalidCount++
        } else if (seenWallets.has(wallet.toLowerCase())) {
          status = "duplicate"
          error = "Duplicate wallet address"
          duplicateCount++
        } else {
          validCount++
          seenWallets.add(wallet.toLowerCase())
        }

        processedData.push({
          wallet,
          allocation,
          status,
          error,
        })
      }

      setPreviewData({
        totalWallets: lines.length - 1,
        validWallets: validCount,
        invalidWallets: invalidCount,
        duplicateWallets: duplicateCount,
        previewData: processedData,
      })
      setIsProcessing(false)
    }

    reader.readAsText(file)
  }, [])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        processCSV(acceptedFiles[0])
      }
    },
    [processCSV],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv"],
    },
    maxFiles: 1,
  })

  if (!previewData) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload CSV File
          </CardTitle>
          <CardDescription>Upload a CSV file containing wallet addresses and allocations</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            }`}
          >
            <input {...getInputProps()} />
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p>Drop the CSV file here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">Drag & drop a CSV file here</p>
                <p className="text-muted-foreground mb-4">or click to select a file</p>
                <Button variant="outline">Select File</Button>
              </div>
            )}
          </div>

          {isProcessing && (
            <div className="mt-4">
              <Progress value={undefined} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">Processing CSV file...</p>
            </div>
          )}

          <Alert className="mt-4">
            <AlertDescription>
              Expected format: CSV with columns for wallet addresses and allocations. Headers should include "wallet" or
              "address" and "allocation" or "amount".
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            CSV Preview
          </span>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription>Review the processed data before importing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{previewData.totalWallets}</div>
              <p className="text-sm text-muted-foreground">Total Wallets</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{previewData.validWallets}</div>
              <p className="text-sm text-muted-foreground">Valid Wallets</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{previewData.invalidWallets}</div>
              <p className="text-sm text-muted-foreground">Invalid Wallets</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{previewData.duplicateWallets}</div>
              <p className="text-sm text-muted-foreground">Duplicate Wallets</p>
            </CardContent>
          </Card>
        </div>

        {/* Preview Table */}
        <div>
          <h3 className="text-lg font-medium mb-4">Preview (First 100 rows)</h3>
          <div className="border rounded-lg max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>Allocation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.previewData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm">{row.wallet}</TableCell>
                    <TableCell>{row.allocation}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          row.status === "valid" ? "default" : row.status === "invalid" ? "destructive" : "secondary"
                        }
                        className="flex items-center gap-1 w-fit"
                      >
                        {row.status === "valid" && <CheckCircle className="h-3 w-3" />}
                        {row.status === "invalid" && <X className="h-3 w-3" />}
                        {row.status === "duplicate" && <AlertTriangle className="h-3 w-3" />}
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{row.error}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download Error Report
            </Button>
          </div>
          <Button onClick={() => onImport(previewData)} disabled={previewData.validWallets === 0} className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Import {previewData.validWallets} Valid Wallets
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
