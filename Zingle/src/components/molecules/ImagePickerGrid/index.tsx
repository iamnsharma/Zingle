import React from 'react';
import {
  StyleSheet,
  View,
  ViewProps,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore } from '@stores';
import { metrics } from '@styling/metrics';
import { BaseText } from '@components/atoms';

interface ImagePickerGridProps extends ViewProps {
  images: Array<{ id: string; uri: string }>;
  onAddPress?: (index: number) => void;
  onRemovePress?: (id: string) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  maxImages?: number;
  columns?: number;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: metrics.spacing.lg,
    paddingVertical: metrics.spacing.md,
  },
  gridContainer: {
    gap: metrics.spacing.md,
  },
  gridRow: {
    flexDirection: 'row',
    gap: metrics.spacing.md,
  },
  gridItem: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: metrics.radius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: metrics.radius.lg,
  },
  addIcon: {
    fontSize: 32,
    marginBottom: metrics.spacing.sm,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  reorderBar: {
    position: 'absolute',
    left: 6,
    right: 6,
    bottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reorderBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
});

export const ImagePickerGrid = React.forwardRef<View, ImagePickerGridProps>(
  (
    {
      images = [],
      onAddPress,
      onRemovePress,
      onReorder,
      maxImages = 6,
      columns = 3,
      style: customStyle,
      ...props
    },
    ref
  ) => {
    const { theme } = useThemeStore();
    const { width } = useWindowDimensions();

    const itemWidth = (width - metrics.spacing.lg * 2 - metrics.spacing.md * (columns - 1)) / columns;

    const renderGridItem = (item: { id: string; uri: string }, index: number) => (
      <View
        key={item.id}
        style={[
          styles.gridItem,
          {
            width: itemWidth,
            height: itemWidth,
          },
        ]}
      >
        <Image
          source={{ uri: item.uri }}
          style={styles.image}
        />
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemovePress?.(item.id)}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <MaterialCommunityIcons name="close" size={16} color="#FFFFFF" />
        </TouchableOpacity>
        {onReorder && images.length > 1 ? (
          <View style={styles.reorderBar}>
            <TouchableOpacity
              style={[
                styles.reorderBtn,
                { opacity: index === 0 ? 0.35 : 1 },
              ]}
              disabled={index === 0}
              onPress={() => onReorder(index, index - 1)}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.reorderBtn,
                { opacity: index === images.length - 1 ? 0.35 : 1 },
              ]}
              disabled={index === images.length - 1}
              onPress={() => onReorder(index, index + 1)}
            >
              <MaterialCommunityIcons
                name="chevron-right"
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );

    const renderAddButton = (index: number) => (
      <TouchableOpacity
        key={`add-${index}`}
        style={[
          styles.gridItem,
          styles.addButton,
          {
            width: itemWidth,
            height: itemWidth,
            borderColor: theme.custom.border,
            backgroundColor: theme.custom.surfaceVariant,
          },
        ]}
        onPress={() => onAddPress?.(index)}
      >
        <BaseText
          variant="h2"
          color={theme.custom.textSecondary}
          children="+"
        />
      </TouchableOpacity>
    );

    const items = [];
    for (let i = 0; i < maxImages; i++) {
      if (i < images.length) {
        items.push(renderGridItem(images[i], i));
      } else {
        items.push(renderAddButton(i));
      }
    }

    const rows = [];
    for (let i = 0; i < items.length; i += columns) {
      rows.push(
        <View key={`row-${i}`} style={styles.gridRow}>
          {items.slice(i, i + columns)}
        </View>
      );
    }

    return (
      <View ref={ref} style={[styles.container, customStyle]} {...props}>
        <View style={styles.gridContainer}>
          {rows}
        </View>
      </View>
    );
  }
);

ImagePickerGrid.displayName = 'ImagePickerGrid';
