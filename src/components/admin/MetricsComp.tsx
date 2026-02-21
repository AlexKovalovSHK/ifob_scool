import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    LinearProgress
} from '@mui/material';
import { getSummaryStats, getPopularPages, getDetailedStats } from '../../features/analytics/analytics.service';

interface SummaryStats {
    totalViews: number;
    uniqueVisitorsCount: number;
    avgDuration: number;
}

interface PageStat {
    _id: string;
    count: number;
    avgTime: number;
}

interface DetailedStats {
    countries: { name: string, value: number }[];
    devices: { name: string, value: number }[];
    browsers: { name: string, value: number }[];
    referrers: { name: string, value: number }[];
    utmSources: { name: string, value: number }[];
    depth: string;
    bounceRate: string;
}

export const MetricsComp = () => {
    const [summary, setSummary] = useState<SummaryStats | null>(null);
    const [pages, setPages] = useState<PageStat[]>([]);
    const [detailed, setDetailed] = useState<DetailedStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [s, p, d] = await Promise.all([
                    getSummaryStats(),
                    getPopularPages(),
                    getDetailedStats()
                ]);
                setSummary(s);
                setPages(p);
                setDetailed(d);
            } catch (err) {
                console.error("Failed to fetch metrics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    const StatCard = ({ title, value, subtitle }: { title: string, value: string | number, subtitle?: string }) => (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography color="textSecondary" gutterBottom variant="overline" sx={{ display: 'block' }}>
                    {title}
                </Typography>
                <Typography variant="h4" component="div">
                    {value}
                </Typography>
                {subtitle && (
                    <Typography variant="body2" color="textSecondary">
                        {subtitle}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );

    const DistributionList = ({ title, items }: { title: string, items: { name: string, value: number }[] }) => {
        const max = Math.max(...items.map(i => i.value), 1);
        return (
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>{title}</Typography>
                    <List dense>
                        {items.map((item, idx) => (
                            <ListItem key={idx} sx={{ flexDirection: 'column', alignItems: 'flex-start', px: 0 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 0.5 }}>
                                    <ListItemText primary={item.name || 'Unknown'} primaryTypographyProps={{ variant: 'body2' }} />
                                    <Typography variant="body2">{item.value}</Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={(item.value / max) * 100}
                                    sx={{ width: '100%', height: 6, borderRadius: 3 }}
                                />
                            </ListItem>
                        ))}
                        {items.length === 0 && <Typography variant="body2" color="textSecondary">Нет данных</Typography>}
                    </List>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box sx={{ flexGrow: 1, p: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
                Аналитика посещаемости
            </Typography>

            {/* Traffic & Engagement Summary */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="Просмотры" value={summary?.totalViews || 0} subtitle="Всего запросов" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="Уникальные" value={summary?.uniqueVisitorsCount || 0} subtitle="Пользователей" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <StatCard title="Ср. время" value={`${summary?.avgDuration || 0}с`} subtitle="На странице" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <StatCard title="Глубина" value={detailed?.depth || "0"} subtitle="Стр / Сессия" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <StatCard title="Отказы" value={detailed?.bounceRate || "0%"} subtitle="Bounce Rate" />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Popular Pages */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Популярные страницы</Typography>
                            <List>
                                {pages.map((page, idx) => (
                                    <React.Fragment key={idx}>
                                        <ListItem>
                                            <ListItemText
                                                primary={page._id}
                                                secondary={`Просмотров: ${page.count} | Ср. время: ${Math.round(page.avgTime)}с`}
                                            />
                                        </ListItem>
                                        {idx < pages.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Geography */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <DistributionList title="Топ стран" items={detailed?.countries || []} />
                </Grid>

                {/* Devices & Browsers */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <DistributionList title="Устройства" items={detailed?.devices || []} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <DistributionList title="Браузеры" items={detailed?.browsers || []} />
                </Grid>

                {/* Marketing */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <DistributionList title="Источники (UTM)" items={detailed?.utmSources || []} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <DistributionList title="Рефералы (Referrers)" items={detailed?.referrers || []} />
                </Grid>
            </Grid>
        </Box>
    );
};