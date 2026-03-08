import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { articles } from "@/lib/demo-data";

export default function AdminArticlesPage() {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-950">
          Articles and case studies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Article</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.slug}>
                <TableCell>
                  <div>
                    <p className="font-medium text-slate-950">{article.title.en}</p>
                    <p className="text-sm text-slate-500">{article.slug}</p>
                  </div>
                </TableCell>
                <TableCell>{article.category.en}</TableCell>
                <TableCell>{article.publishedAt}</TableCell>
                <TableCell>
                  <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100">
                    Published
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
