import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Gallery, Item as GalleryItem } from 'react-photoswipe-gallery';
import { Button, Grid } from 'semantic-ui-react';
import { useToggle } from '../../../lib/hooks';

import Item from './Item';

import styles from './Attachments.module.scss';

const INITIALLY_VISIBLE = 4;

const Attachments = React.memo(
  ({ items, onUpdate, onDelete, onCoverUpdate, onGalleryOpen, onGalleryClose }) => {
    const [t] = useTranslation();
    const [isAllVisible, toggleAllVisible] = useToggle();

    const handleCoverSelect = useCallback(
      (id) => {
        onCoverUpdate(id);
      },
      [onCoverUpdate],
    );

    const handleCoverDeselect = useCallback(() => {
      onCoverUpdate(null);
    }, [onCoverUpdate]);

    const handleUpdate = useCallback(
      (id, data) => {
        onUpdate(id, data);
      },
      [onUpdate],
    );

    const handleDelete = useCallback(
      (id) => {
        onDelete(id);
      },
      [onDelete],
    );

    const handleBeforeGalleryOpen = useCallback(
      (gallery) => {
        onGalleryOpen();

        gallery.on('destroy', () => {
          onGalleryClose();
        });
      },
      [onGalleryOpen, onGalleryClose],
    );

    const handleToggleAllVisibleClick = useCallback(() => {
      toggleAllVisible();
    }, [toggleAllVisible]);

    const galleryItemsNode = items.map((item, index) => {
      const props = item.coverUrl
        ? {
            width: item.imageWidth,
            height: item.imageHeight,
          }
        : {
            content: (
              <Grid verticalAlign="middle" className={styles.contentWrapper}>
                <Grid.Column textAlign="center" className={styles.content}>
                  {t('common.thereIsNoPreviewAvailableForThisAttachment')}
                </Grid.Column>
              </Grid>
            ),
          };

      const isVisible = isAllVisible || index < INITIALLY_VISIBLE;

      return (
        <GalleryItem
          {...props} // eslint-disable-line react/jsx-props-no-spreading
          key={item.id}
          original={item.url}
          caption={item.name}
        >
          {({ ref, open }) =>
            isVisible ? (
              <Item
                ref={ref}
                name={item.name}
                url={item.url}
                coverUrl={item.coverUrl}
                createdAt={item.createdAt}
                isCover={item.isCover}
                isPersisted={item.isPersisted}
                onClick={item.coverUrl ? open : undefined}
                onCoverSelect={() => handleCoverSelect(item.id)}
                onCoverDeselect={handleCoverDeselect}
                onUpdate={(data) => handleUpdate(item.id, data)}
                onDelete={() => handleDelete(item.id)}
              />
            ) : (
              <span ref={ref} />
            )
          }
        </GalleryItem>
      );
    });

    return (
      <>
        <Gallery
          withCaption
          withDownloadButton
          options={{
            showHideAnimationType: 'none',
            closeTitle: '',
            zoomTitle: '',
            arrowPrevTitle: '',
            arrowNextTitle: '',
            errorMsg: '',
          }}
          onBeforeOpen={handleBeforeGalleryOpen}
        >
          {galleryItemsNode}
        </Gallery>
        {items.length > INITIALLY_VISIBLE && (
          <Button
            fluid
            content={
              isAllVisible
                ? t('action.showFewerAttachments')
                : t('action.showAllAttachments', {
                    hidden: items.length - INITIALLY_VISIBLE,
                  })
            }
            className={styles.toggleButton}
            onClick={handleToggleAllVisibleClick}
          />
        )}
      </>
    );
  },
);

Attachments.propTypes = {
  items: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCoverUpdate: PropTypes.func.isRequired,
  onGalleryOpen: PropTypes.func.isRequired,
  onGalleryClose: PropTypes.func.isRequired,
};

export default Attachments;
