"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/hooks/useRouter";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FileText, Cog, Video, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalyticsData {
  stats: {
    blogs: { published: number; draft: number; total: number };
    services: { published: number; draft: number; total: number };
    videos: { published: number; draft: number; total: number };
    messages: { total: number; unread: number };
  };
  chartData: { label: string; count: number }[];
  recentBlogs: Array<{
    id: number;
    title: string;
    slug: string;
    status: string;
    created_at: string;
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("daily");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/analytics?range=${timeRange}`, { credentials: "include" })
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/admin/login";
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data && data.stats?.blogs) {
          setAnalytics(data);
        } else if (data) {
          setAnalytics(null);
        }
      })
      .catch(() => setAnalytics(null))
      .finally(() => setLoading(false));
  }, [timeRange]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your admin dashboard
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        ) : analytics ? (
          <>
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card
                className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
                onClick={() => router.push("/admin/blogs")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Blogs
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics.stats.blogs.total || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.stats.blogs.published || 0} published,{" "}
                    {analytics.stats.blogs.draft || 0} draft
                  </p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
                onClick={() => router.push("/admin/services")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Services
                  </CardTitle>
                  <Cog className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics.stats.services.total || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.stats.services.published || 0} published,{" "}
                    {analytics.stats.services.draft || 0} draft
                  </p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
                onClick={() => router.push("/admin/videos")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Videos
                  </CardTitle>
                  <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics.stats.videos.total || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.stats.videos.published || 0} published,{" "}
                    {analytics.stats.videos.draft || 0} draft
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Chart Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Blog Creation Analytics
                  </CardTitle>
                  <Tabs
                    value={timeRange}
                    onValueChange={(value) =>
                      setTimeRange(value as "daily" | "weekly" | "monthly")
                    }
                  >
                    <TabsList>
                      <TabsTrigger value="daily">Daily</TabsTrigger>
                      <TabsTrigger value="weekly">Weekly</TabsTrigger>
                      <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {analytics.chartData && analytics.chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.chartData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-muted"
                        />
                        <XAxis
                          dataKey="label"
                          className="text-xs"
                          stroke="#888888"
                        />
                        <YAxis className="text-xs" stroke="#888888" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#007D7D"
                          strokeWidth={3}
                          dot={{ fill: "#007D7D", r: 4, strokeWidth: 2 }}
                          activeDot={{
                            r: 6,
                            fill: "#007D7D",
                            stroke: "#007D7D",
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Blogs Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Blogs
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/admin/blogs")}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {analytics.recentBlogs && analytics.recentBlogs.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.recentBlogs.map((blog) => (
                      <div
                        key={blog.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => router.push(`/admin/blogs`)}
                      >
                        <div className="flex-1">
                          <h3 className="font-medium">{blog.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(blog.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              blog.status === "published"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}
                          >
                            {blog.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent blogs found
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            Failed to load analytics
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
