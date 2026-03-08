import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inquiries } from "@/lib/demo-data";

export default function AdminInquiriesPage() {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-950">
          Lead inbox
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Market</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((inquiry) => (
              <TableRow key={inquiry.id}>
                <TableCell className="font-medium text-slate-950">{inquiry.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-slate-950">{inquiry.name}</p>
                    <p className="text-sm text-slate-500">{inquiry.company}</p>
                  </div>
                </TableCell>
                <TableCell>{inquiry.market}</TableCell>
                <TableCell>
                  <Badge variant="outline">{inquiry.status}</Badge>
                </TableCell>
                <TableCell>{inquiry.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
