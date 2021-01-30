import React from "react";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const ListItemSkeleton = () => {

  return (
    <SkeletonPlaceholder>
    <SkeletonPlaceholder.Item flexDirection="row" margin={10} marginTop={10}>
      <SkeletonPlaceholder.Item
        width={50}
        height={50}
        borderRadius={50}
      />
      <SkeletonPlaceholder.Item marginLeft={10} marginTop={6}>
        <SkeletonPlaceholder.Item
          width={250}
          height={14}
          borderRadius={4}
        />
        <SkeletonPlaceholder.Item
          marginTop={6}
          width={160}
          height={14}
          borderRadius={4}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder.Item>
  </SkeletonPlaceholder>
  );
};

export default ListItemSkeleton;
