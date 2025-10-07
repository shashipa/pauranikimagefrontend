'use client';

import { Container, Row, Col, Button, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './page.css';

const IMG =
  'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1600&auto=format&fit=crop';

export default function Download() {
  const views = 1750;
  const downloads = 888;

  return (
    <section className="aw-wrap">
      <Container fluid="xl">
        <Row className="gy-4">
          {/* LEFT: Artwork */}
          <Col lg={8}>
            <div className="aw-canvas">
              <img src={IMG} alt="Dancing in the Rain — Illustration" />
            </div>
          </Col>

          {/* RIGHT: Actions / Info */}
          <Col lg={4}>
            <aside className="aw-panel">
              <div className="aw-license">
                <i className="bi bi-shield-check"></i>
                <div>
                  <div className="aw-license-title">Free for use</div>
                  <a href="#" className="aw-license-link">Read content license</a>
                </div>
              </div>

              <div className="aw-actions">
                <OverlayTrigger placement="bottom" overlay={<Tooltip>Like</Tooltip>}>
                  <button className="aw-icon">
                    <i className="bi bi-heart"></i>
                    <span>36</span>
                  </button>
                </OverlayTrigger>

                <OverlayTrigger placement="bottom" overlay={<Tooltip>Save</Tooltip>}>
                  <button className="aw-icon">
                    <i className="bi bi-bookmark"></i>
                    <span>Save</span>
                  </button>
                </OverlayTrigger>

                <OverlayTrigger placement="bottom" overlay={<Tooltip>Comment</Tooltip>}>
                  <button className="aw-icon">
                    <i className="bi bi-chat-dots"></i>
                    <span>Comment</span>
                  </button>
                </OverlayTrigger>

                <OverlayTrigger placement="bottom" overlay={<Tooltip>Share</Tooltip>}>
                  <button className="aw-icon">
                    <i className="bi bi-share"></i>
                    <span>Share</span>
                  </button>
                </OverlayTrigger>
              </div>

              <div className="aw-stats">
                <div className="aw-stat">
                  <i className="bi bi-eye"></i>
                  <div>
                    <div className="label">Views</div>
                    <div className="value">{views.toLocaleString()}</div>
                  </div>
                </div>
                <div className="aw-stat">
                  <i className="bi bi-download"></i>
                  <div>
                    <div className="label">Downloads</div>
                    <div className="value">{downloads.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="aw-download">
                <Button
                  size="lg"
                  className="aw-btn-download"
                  href={IMG}
                  download
                >
                  <i className="bi bi-download me-2"></i>
                  Download
                  <Badge bg="" className="aw-size-badge ms-2">3840×2160</Badge>
                </Button>
                <div className="aw-file-ops">
                  <Button variant="outline-dark" size="sm"><i className="bi bi-crop me-1"></i>Edit</Button>
                  <Button variant="outline-dark" size="sm"><i className="bi bi-arrows-fullscreen me-1"></i>Preview</Button>
                </div>
              </div>

              <div className="aw-author">
                <img
                  src="https://i.pravatar.cc/100?img=12"
                  alt="author"
                  className="avatar"
                />
                <div className="meta">
                  <div className="name">kirillslov</div>
                  <div className="sub">1,205 followers</div>
                </div>
                <Button variant="dark" size="sm" className="follow"><i className="bi bi-plus-lg me-1"></i>Follow</Button>
              </div>

              <div className="aw-donate">
                <Button variant="outline-dark" className="w-100">
                  <i className="bi bi-heart-fill me-2"></i>Donate
                </Button>
              </div>
            </aside>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
