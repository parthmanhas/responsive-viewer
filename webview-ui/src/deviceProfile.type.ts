export type DeviceProfile = {
    id: string | number;
    width: number;
    height: number;
    name: string;
    deviceType: 'mobile' | 'tab' | 'desktop';
};
