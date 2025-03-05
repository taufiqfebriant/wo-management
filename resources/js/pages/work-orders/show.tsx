import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';

type WorkOrderProgress = {
  id: number;
  progress_notes: string;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
};

type WorkOrderUpdate = {
  id: number;
  previous_status: string;
  new_status: string;
  quantity_processed: number;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
};

type WorkOrder = {
  id: number;
  number: string;
  product: {
    id: number;
    name: string;
  };
  quantity: number;
  deadline: string;
  status: string;
  operator: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
  work_order_progress: WorkOrderProgress[];
  work_order_updates: WorkOrderUpdate[];
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Work Orders',
    href: '/work-orders',
  },
  {
    title: 'Detail',
    href: '#',
  },
];

export default function ShowWorkOrder({ workOrder }: { workOrder: WorkOrder }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Work Order ${workOrder.number}`} />

      <div className="space-y-8 px-4 py-6">
        {/* Work Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Work Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Number</p>
                <p className="font-medium">{workOrder.number}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Status</p>
                <Badge>{workOrder.status}</Badge>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Product</p>
                <p className="font-medium">{workOrder.product.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Quantity</p>
                <p className="font-medium">{workOrder.quantity}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Deadline</p>
                <p className="font-medium">{format(parseISO(workOrder.deadline), 'PPP')}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Operator</p>
                <p className="font-medium">{workOrder.operator.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Updates */}
        <Card>
          <CardHeader>
            <CardTitle>Status Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workOrder.work_order_updates.map((update) => (
                <div key={update.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        Status changed from {update.previous_status} to {update.new_status}
                      </p>
                      <p className="text-muted-foreground text-sm">Quantity processed: {update.quantity_processed}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{update.user.name}</p>
                      <p className="text-muted-foreground text-sm">{format(parseISO(update.created_at), 'PPP p')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workOrder.work_order_progress.map((progress) => (
                <div key={progress.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-start justify-between">
                    <p className="font-medium">{progress.progress_notes}</p>
                    <div className="text-right">
                      <p className="text-sm">{progress.user.name}</p>
                      <p className="text-muted-foreground text-sm">{format(parseISO(progress.created_at), 'PPP p')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
