import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { products } from "@/lib/demo-data";

export default function AdminProductsPage() {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-950">
          Product catalog management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Locale coverage</TableHead>
              <TableHead>SEO ready</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.slug}>
                <TableCell>
                  <div>
                    <p className="font-medium text-slate-950">{product.title.en}</p>
                    <p className="text-sm text-slate-500">{product.slug}</p>
                  </div>
                </TableCell>
                <TableCell>{product.category.en}</TableCell>
                <TableCell>
                  <Badge variant="outline">ZH / EN</Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                    Metadata + schema
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
