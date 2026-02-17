import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CurrentUserCardProps {
  position: number;
}

export function CurrentUserCard({ position }: CurrentUserCardProps) {
  return (
    <Card className="mb-6 bg-primary/5 border-primary/20">
      <CardContent className="p-4 flex items-center gap-3">
        <User className="size-5 text-primary" />
        <span className="text-sm text-foreground">
          Your position:{" "}
          <span className="font-bold text-primary">#{position}</span>
        </span>
      </CardContent>
    </Card>
  );
}
