import BucketFileReader from '@/pages/components/BucketFileReader';
import BucketFileList from '@/pages/components/BucketFileList';

export default function BucketHome() {
  return (
    <div>
        <BucketFileReader/>
        <BucketFileList/>
    </div>
  );
}
