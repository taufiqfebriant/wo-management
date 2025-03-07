import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { getWorkOrderStatusString } from '@/lib/utils';
import type { BreadcrumbItem, SharedData, WorkOrder } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Work Orders',
    href: route('work-orders.index'),
  },
  {
    title: 'Detail',
    href: '#',
  },
];

type WorkOrderProps = SharedData & {
  workOrder: WorkOrder;
};

export default function WorkOrder(props: WorkOrderProps) {
  const { message } = props.flash;

  useEffect(() => {
    if (!message) {
      return;
    }

    const timerId = setTimeout(() => {
      toast(message);
    });

    return () => {
      clearTimeout(timerId);
    };
  }, [message]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Work Order ${props.workOrder.number}`} />

      <div className="space-y-8 px-4 py-6">
        <div className="space-y-0.5">
          <h2 className="text-xl font-semibold tracking-tight">Work Order Details</h2>
          <p className="text-muted-foreground text-sm">View the details of the work order</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Work Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Number</p>
                <p className="font-medium">{props.workOrder.number}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Status</p>
                <Badge>{getWorkOrderStatusString(props.workOrder.status)}</Badge>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Product</p>
                <p className="font-medium">{props.workOrder.product?.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Quantity</p>
                <p className="font-medium">{props.workOrder.quantity}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Deadline</p>
                <p className="font-medium">{format(parseISO(props.workOrder.deadline), 'PPP')}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Operator</p>
                <p className="font-medium">{props.workOrder.user?.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {props.workOrder.work_order_updates?.map((update) => (
                <div key={update.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        {update.previous_status === update.new_status
                          ? `Status updated to ${getWorkOrderStatusString(update.new_status)}`
                          : `Status changed from ${getWorkOrderStatusString(update.previous_status)} to ${getWorkOrderStatusString(update.new_status)}`}
                      </p>
                      <p className="text-muted-foreground text-sm">Quantity processed: {update.quantity_processed}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{update.user?.name}</p>
                      <p className="text-muted-foreground text-sm">{update.created_at ? format(parseISO(update.created_at), 'PPP p') : '-'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {props.workOrder.work_order_progress?.map((progress) => (
                <div key={progress.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-start justify-between">
                    <p className="font-medium">{progress.progress_notes}</p>
                    <div className="text-right">
                      <p className="text-sm">{progress.user?.name}</p>
                      <p className="text-muted-foreground text-sm">{progress.created_at ? format(parseISO(progress.created_at), 'PPP p') : '-'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button variant="outline" asChild>
          <Link href={route('work-orders.index')}>Back</Link>
        </Button>
      </div>
    </AppLayout>
  );
}
