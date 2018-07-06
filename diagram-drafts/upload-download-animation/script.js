const totalSegments = 3;
const stripesPerSegment = 5;
const erasureSharesPerStripe = 5;

// globals
let sandboxWidth;
let sandboxHeight;
let currentStep;
let lastStep = 7;
let segments = [];
let erasureShares = [];
let farmers = [];
let labels = {};
let labelKeys = [];
let visible = {};

let steps = [{
  step: 0, // display file as solid rectangle
  move: function(info) {
    let segmentWidth = sandboxWidth / (totalSegments + 2); // + 2 is for padding  on left and right
    let segmentHeight = sandboxHeight / 3; // segment height + padding for top and bottom

    // position erasure shares together to form first segment
    let shareHeight = segmentHeight / erasureSharesPerStripe; // stripes are vertical
    let shareWidth = segmentWidth / stripesPerSegment; // pieces are horizontal
    for (let stripe = 0; stripe < stripesPerSegment; stripe++) {
      for (let piece = 0; piece < erasureSharesPerStripe; piece++) {
        let shareEl = erasureShares[stripe][piece];
        let left = segmentWidth + (stripe * shareWidth);
        let top = segmentHeight + (piece * shareHeight);
        let width = shareWidth;
        let height = shareHeight;

        updatePositionAndSize(shareEl, left, top, width, height);
      }
    }

    // position segment divs to be combined with erasure share segment, forming a file
    for (let i = 0; i < segments.length; i++) {
      let segEl = segments[i];
      let left = 2 * segmentWidth + i * segmentWidth;
      let top = segmentHeight;
      let width = segmentWidth;
      let height = segmentHeight;

      updatePositionAndSize(segEl, left, top, width, height);
    }

    // position file label div
    let fileLabel = labels['file'];
    let left = segmentWidth - 20;
    let top = segmentHeight - 50;
    let width = 3 * segmentWidth + 40;
    let height = segmentHeight + 70;
    updatePositionAndSize(fileLabel, left, top, width, height);

    visible = {
      segments: true,
      labels: {
        file: true
      }
    };
  }
}, {
  step: 1, // display each file segment as a solid rectangle
  move: function(info) {
    let segmentWidth = sandboxWidth / (totalSegments + 1 + .5 * (totalSegments - 1)); // + 1 is for padding  on left and right the rest is for padding between segments
    let segmentHeight = sandboxHeight / 3; // segment height + padding for top and bottom

    // position erasure shares together to form first segment
    let shareHeight = segmentHeight / erasureSharesPerStripe;
    let shareWidth = segmentWidth / stripesPerSegment;
    for (let stripe = 0; stripe < stripesPerSegment; stripe++) {
      for (let piece = 0; piece < erasureSharesPerStripe; piece++) {
        let shareEl = erasureShares[stripe][piece];
        let left = .5 * segmentWidth + (stripe * shareWidth);
        let top = segmentHeight + (piece * shareHeight);
        let width = shareWidth;
        let height = shareHeight;

        updatePositionAndSize(shareEl, left, top, width, height);
      }
    }


    // position segment divs to be separate from erasure share segment
    for (let i = 0; i < segments.length; i++) {
      let segEl = segments[i];
      let left = 1.5 * segmentWidth + (.5 * (i + 1) * segmentWidth) + i * segmentWidth;
      let top = segmentHeight;
      let width = segmentWidth;
      let height = segmentHeight;

      updatePositionAndSize(segEl, left, top, width, height);
    }

    // position file label div
    let fileLabel = labels['file'];
    let left = 0.5 * segmentWidth - 40;
    let top = segmentHeight - 80;
    let width = (3 + .5 * (totalSegments - 1)) * segmentWidth + 80;
    let height = segmentHeight + 120;
    updatePositionAndSize(fileLabel, left, top, width, height);
    makeVisible(fileLabel);

    // position segment label div
    let segmentLabel = labels['segment'];
    left = 0.5 * segmentWidth - 20;
    top = segmentHeight - 50;
    width = segmentWidth  + 40;
    height = segmentHeight + 70;
    updatePositionAndSize(segmentLabel, left, top, width, height);

    visible = {
      segments: true,
      labels: {
        segment: true,
        file: true
      }
    };
  }
}, {
  step: 2, // display a single segment as a solid rectangle
  move: function(info) {
    let segmentWidth = sandboxWidth / 3; // 1 unit for segment, 2 for left/right padding
    let segmentHeight = sandboxHeight / 3;
    // position erasure shares together in the center
    let shareHeight = segmentHeight / erasureSharesPerStripe;
    let shareWidth = segmentWidth / stripesPerSegment;
    for (let stripe = 0; stripe < stripesPerSegment; stripe++) {
      for (let piece = 0; piece < erasureSharesPerStripe; piece++) {
        let shareEl = erasureShares[stripe][piece];
        let left = segmentWidth + (stripe * shareWidth);
        let top = segmentHeight + (piece * shareHeight);
        let width = shareWidth;
        let height = shareHeight;
        updatePositionAndSize(shareEl, left, top, width, height);
      }
    }

    // position segment label div
    let segmentLabel = labels['segment'];
    let left = segmentWidth - 20;
    let top = segmentHeight - 50;
    let width = segmentWidth  + 40;
    let height = segmentHeight + 70;
    updatePositionAndSize(segmentLabel, left, top, width, height);

    visible = {
      labels: {
        segment: true
      }
    };
  }
}, {
  step: 3, // display the segment's stripes as individual rectangles
  move: function(info) {
    let stripeWidth = sandboxWidth / (stripesPerSegment + .5 * (stripesPerSegment - 1) + 2); // 1 unit for stripe, 2 for left/right padding, 1/2 for padding between stripes
    let stripeHeight = sandboxHeight / 3;
    // separate erasure shares into vertical stripes
    let shareHeight = stripeHeight / erasureSharesPerStripe;
    let shareWidth = stripeWidth;
    for (let stripe = 0; stripe < stripesPerSegment; stripe++) {
      for (let piece = 0; piece < erasureSharesPerStripe; piece++) {
        let shareEl = erasureShares[stripe][piece];
        let left = stripeWidth + (stripe * stripeWidth) + (stripe * .5 * stripeWidth);
        let top = stripeHeight + (piece * shareHeight);
        let width = shareWidth;
        let height = shareHeight;
        updatePositionAndSize(shareEl, left, top, width, height);
      }
    }

    // position segment label div
    let segmentLabel = labels['segment'];
    let left = stripeWidth - 40;
    let top = stripeHeight - 80;
    let width = (stripeWidth * stripesPerSegment) + (0.5 * (stripesPerSegment - 1) * stripeWidth)  + 80;
    let height = stripeHeight + 120;
    updatePositionAndSize(segmentLabel, left, top, width, height);

    // position stripe label div
    let stripeLabel = labels['stripe'];
    left = stripeWidth - 20;
    top = stripeHeight - 40;
    width = stripeWidth  + 40;
    height = stripeHeight + 70;
    updatePositionAndSize(stripeLabel, left, top, width, height);

    visible = {
      labels: {
        stripe: true,
        segment: true
      }
    };
  }
}, {
  step: 4,
  move: function(info) {
    // separate erasure shares completely
    let shareWidth = sandboxWidth / (1 + 2 * stripesPerSegment);
    let shareHeight = sandboxHeight / (1 + 2 * erasureSharesPerStripe);

    for (let stripe = 0; stripe < stripesPerSegment; stripe++) {
      for (let piece = 0; piece < erasureSharesPerStripe; piece++) {
        let shareEl = erasureShares[stripe][piece];
        let left = shareWidth + (2 * shareWidth * stripe);
        let top = shareHeight + (2 * piece * shareHeight);
        let width = shareWidth;
        let height = shareHeight;
        updatePositionAndSize(shareEl, left, top, width, height);
      }
    }

    // position stripe label div
    let stripeLabel = labels['stripe'];
    let stripeHeight = shareHeight + (shareHeight * erasureSharesPerStripe) * 2;
    let left = shareWidth - 40;
    let top = shareHeight - 80;
    let width = shareWidth  + 80;
    let height = stripeHeight + 20;
    updatePositionAndSize(stripeLabel, left, top, width, height);

    // position erasure share label div
    let shareLabel = labels['erasure-share'];
    left = shareWidth - 20;
    top = shareHeight - 40;
    width = shareWidth  + 40;
    height = shareHeight + 70;
    updatePositionAndSize(shareLabel, left, top, width, height);

    visible = {
      labels: {
        stripe: true,
        'erasure-share': true
      }
    };
  }
}, {
  step: 5,
  move: function(info) {
    let shareHeight = sandboxHeight / (1 + 2 * erasureSharesPerStripe);
    let shareWidth = shareHeight;
    // combine erasure shares into horizontal pieces on the left side
    for (let stripe = 0; stripe < stripesPerSegment; stripe++) {
      for (let piece = 0; piece < erasureSharesPerStripe; piece++) {
        let shareEl = erasureShares[stripe][piece];
        let left = .5 * shareWidth + (shareWidth * stripe);
        let top = shareHeight + (2 * piece * shareHeight);
        let width = shareWidth;
        let height = shareHeight;
        updatePositionAndSize(shareEl, left, top, width, height);
      }
    }

    // position erasure share label div
    let shareLabel = labels['erasure-share'];
    let left = .5 * shareWidth - 20;
    let top = shareHeight - 40;
    let width = shareWidth  + 40;
    let height = shareHeight + 70;
    updatePositionAndSize(shareLabel, left, top, width, height);

    // position piece label div
    let pieceLabel = labels['piece'];
    let pieceWidth = shareWidth * stripesPerSegment;
    left = shareWidth - 80;
    top = shareHeight - 80;
    width = pieceWidth  + 120;
    height = shareHeight + 120;
    updatePositionAndSize(pieceLabel, left, top, width, height);

    // position farmers
    for (let piece = 0; piece < erasureSharesPerStripe; piece++) {
      let farmerEl = farmers[piece];
      left = sandboxWidth - (1.5 * shareWidth);
      top = shareHeight + (2 * piece * shareHeight);
      width = shareWidth;
      height = shareHeight;
      updatePositionAndSize(farmerEl, left, top, width, height);
    }

    // position farmer label div
    let farmerLabel = labels['farmer'];
    left = sandboxWidth - (1.5 * shareWidth) - 20;
    top = shareHeight - 40;
    width = shareWidth  + 40;
    height = shareHeight + 70;
    updatePositionAndSize(farmerLabel, left, top, width, height);

    visible = {
      farmers: true,
      labels: {
        piece: true,
        'erasure-share': true,
        farmer: true
      }
    };

  }
}, {
  step: 6,
  move: function(info) {
    let shareHeight = sandboxHeight / (1 + 2 * erasureSharesPerStripe);
    let shareWidth = shareHeight;
    // reposition erasure shares to move towards farmers in random intervals over 5s
    for (let piece = 0; piece < erasureSharesPerStripe; piece++) {
      sendPiece(piece, stripesPerSegment - 1, shareWidth, shareHeight);
    }

    // position piece label div
    let pieceLabel = labels['piece'];
    let pieceWidth = shareWidth * stripesPerSegment;
    let left = sandboxWidth - pieceWidth - 2 * shareWidth - 10;
    let top = shareHeight - 40;
    let width = pieceWidth  + 20;
    let height = shareHeight + 70;
    updatePositionAndSize(pieceLabel, left, top, width, height);

    // position farmers
    for (let piece = 0; piece < erasureSharesPerStripe; piece++) {
      let farmerEl = farmers[piece];
      left = sandboxWidth - (1.5 * shareWidth);
      top = shareHeight + (2 * piece * shareHeight);
      width = shareWidth;
      height = shareHeight;
      updatePositionAndSize(farmerEl, left, top, width, height);
    }

    // position farmer label div
    let farmerLabel = labels['farmer'];
    left = sandboxWidth - shareWidth - 40;
    top = shareHeight - 40;
    width = shareWidth  + 40;
    height = shareHeight + 70;
    updatePositionAndSize(farmerLabel, left, top, width, height);

    visible = {
      farmers: true,
      labels: {
        piece: true,
        farmer: true
      }
    };
  }
}];

function sendPiece(piece, stripe, shareWidth, shareHeight) {
  if (stripe < 0) {
    return;
  }

  let delayTime = Math.floor(Math.random() * 500) + 250;
  setTimeout(function() {
    let shareEl = erasureShares[stripe][piece];
    let left = sandboxWidth - 2 * shareWidth - (stripesPerSegment - stripe) * shareWidth;
    let top = shareHeight + (2 * piece * shareHeight);
    let width = shareWidth;
    let height = shareHeight;
    updatePositionAndSize(shareEl, left, top, width, height);

    sendPiece(piece, stripe - 1, shareWidth, shareHeight);

  }, delayTime);
}

function init() {
  let sandbox = $('#sandbox');
  sandboxWidth = sandbox.width();
  sandboxHeight = sandbox.height();
  //finalShareSize = sandboxWidth / ((erasureSharesPerStripe + paritySharesPerStripe) * 2);
  segments = [];
  erasureShares = [];
  farmers = [];
  labels = {};


  $('.next').click(function() {
    if (currentStep < lastStep) {
      goToStep(currentStep + 1);
    }
  });
  $('.prev').click(function() {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  });

  for (let i=0; i < totalSegments - 1; i++) { // the "first" segment is formed by erasure shard elements, hence - 1
    let newEl = '<div class="segment" segment="' + i + '"></div>';
    sandbox.append(newEl);
    let jqueryEl = $('.segment[segment="' + i + '"]');
    segments.push(jqueryEl);
  }

  for (let stripe = 0; stripe < stripesPerSegment; stripe++) {
    erasureShares.push([]);

    for (let piece = 0; piece < erasureSharesPerStripe; piece++) {
      let newEl = '<div class="erasure-share" stripe="' + stripe + '" piece="' + piece + '"></div>';

      sandbox.append(newEl);
      let jqueryEl = $('[stripe="' + stripe + '"][piece="' + piece + '"]');
      erasureShares[stripe].push(jqueryEl);
    }
  }

  for (let piece = 0; piece < erasureSharesPerStripe; piece++) {
    let newEl = '<div class="farmer" piece="' + piece + '"></div>';
    sandbox.append(newEl);
    let jqueryEl = $('.farmer[piece="' + piece + '"]');
    farmers.push(jqueryEl);
  }

  let labelEls = '<div class="label file-label">file</div>';
  labelEls += '<div class="label segment-label">segment</div>';
  labelEls += '<div class="label stripe-label">stripe</div>';
  labelEls += '<div class="label erasure-share-label">erasure share</div>';
  labelEls += '<div class="label piece-label">piece</div>';
  labelEls += '<div class="label farmer-label">farmer</div>';
  sandbox.append(labelEls);
  labels['file'] = $('.file-label');
  labels['segment'] = $('.segment-label');
  labels['stripe'] = $('.stripe-label');
  labels['erasure-share'] = $('.erasure-share-label');
  labels['piece'] = $('.piece-label');
  labels['farmer'] = $('.farmer-label');
  labelKeys = ['file', 'segment', 'stripe', 'erasure-share', 'piece', 'farmer'];

  currentStep = 0;
  goToStep(currentStep);
}


function goToStep(step) {
  currentStep = step;
  steps[currentStep].move();
  setVisibility();
}

function updatePositionAndSize(el, left, top, width, height) {
  el.css('width', width + 'px');
  el.css('height', height + 'px');
  el.css('top', top + 'px');
  el.css('left', left + 'px');
}

function setVisibility() {
  farmers.forEach(function(farmer) {
    if (visible.farmers) {
      makeVisible(farmer);
    } else {
      makeInvisible(farmer);
    }
  });

  segments.forEach(function(segment) {
    if (visible.segments) {
      makeVisible(segment);
    } else {
      makeInvisible(segment);
    }
  });

  if (visible.labels) {
    labelKeys.forEach(function(key) {
      if (visible.labels[key]) {
        makeVisible(labels[key]);
      } else {
        makeInvisible(labels[key]);
      }
    });
  }
}

function makeVisible(el) {
  el.addClass('visible');
}

function makeInvisible(el) {
  el.removeClass('visible');
}


init();
