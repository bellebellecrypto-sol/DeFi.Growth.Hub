import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[350px] mt-2" />
        </div>
        <Skeleton className="h-10 w-[120px]" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-10 w-[400px]" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-[120px]" />
                  <Skeleton className="h-4 w-[180px] mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-8 w-[80px]" />
                  <Skeleton className="h-4 w-[120px]" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-9 w-[60px]" />
                    <Skeleton className="h-9 w-[60px]" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}
