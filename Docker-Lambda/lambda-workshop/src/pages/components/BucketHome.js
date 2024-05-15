import BucketFileReader from '@/pages/components/BucketFileReader';
import BucketFileList from '@/pages/components/BucketFileList';
import PhotoLoader from '@/pages/components/PhotoLoader';

export default function BucketHome() {
  return (
    <div>
        <BucketFileReader/>
        <BucketFileList/>
        <PhotoLoader/>
    </div>
  );
}
