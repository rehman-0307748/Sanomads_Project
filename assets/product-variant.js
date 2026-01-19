// // Read product data from application/json script
// const product = JSON.parse(
//   document.getElementById('product-data').textContent
// );

// console.log(product);

// // Listen for variant option changes
// document.querySelectorAll('.product-option input[type="radio"]').forEach((radio) => {
//     radio.addEventListener('change', () => {

//       // Collect selected option values
//       const selectedOption = [];
//       document.querySelectorAll('.product-option input[type="radio"]:checked').forEach((radio) => {
//           selectedOption.push(radio.value);
//         });

//       // Find matching variant
//       const matchedVariant = product.variants.find((variant) => {
//         let pass = true;

//         for (let i = 0; i < selectedOption.length; i++) {
//           if (selectedOption.indexOf(variant.options[i]) === -1) {
//             pass = false;
//             break;
//           }
//         }

//         return pass;
//       });

//       console.log(matchedVariant);

//       // Update hidden input + URL
//       if (matchedVariant) {
//         document.querySelector('#product-id').value = matchedVariant.id;
//         const src = document.querySelector('change-image > img');
//         src = src.matchedVariant.featured_image
//         const url = new URL(window.location.href);
//         url.searchParams.set('variant', matchedVariant.id);
//         window.history.replaceState({}, '', url.toString());
//       }

//     });
//   });





document.addEventListener('DOMContentLoaded', () => {
  const productData = document.getElementById('product-data');
  if (!productData) return;

  let product;
  try {
    product = JSON.parse(productData.textContent);
  } catch (e) {
    console.error("Could not parse product JSON", e);
    return;
  }

  if (!product.variants?.length) return;

  const priceContainer = document.querySelector('.product_price');
  const mainImageContainer = document.querySelector('#change-image .product_image_container');
  const variantIdInput = document.getElementById('product-id');

  if (!priceContainer || !mainImageContainer || !variantIdInput) return;

  const mainImage = mainImageContainer.querySelector('img');
  if (!mainImage) return;

  // Format money using the real store format
  function formatMoney(amount) {
    let cents = parseInt(amount, 10);
    if (isNaN(cents)) cents = 0;

    const format = Shopify.money_format || '₨{{amount}}'; // fallback

    let value = (cents / 100).toLocaleString('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

    return format
      .replace(/{{amount}}/g, value)
      .replace(/{{amount_no_decimals}}/g, value.replace(/\.00$/, ''))
      .replace(/{{amount_with_comma_separator}}/g, value.replace(/\./, ','));
  }

  function updateVariantSelection() {
    // Get selected values in correct order
    const selectedOptions = Array.from(
      document.querySelectorAll('.product-option fieldset')
    ).map(fs => {
      const checked = fs.querySelector('input[type="radio"]:checked');
      return checked ? checked.value : null;
    });

    if (selectedOptions.includes(null)) return;

    const variant = product.variants.find(v => {
      return v.options.every((opt, i) => opt === selectedOptions[i]);
    });

    if (!variant) return;

    // Update hidden input
    variantIdInput.value = variant.id;

    // Update URL
    const url = new URL(window.location);
    url.searchParams.set('variant', variant.id);
    history.replaceState({}, '', url);

    // Update price display
    let html = '';

    if (variant.compare_at_price && variant.compare_at_price > variant.price) {
      html = `
        <h2 class="compare-at-price">${formatMoney(variant.compare_at_price)}</h2>
        <h2 class="sale-price">${formatMoney(variant.price)}</h2>
      `;
    } else {
      html = `<h2>${formatMoney(variant.price)}</h2>`;
    }

    priceContainer.innerHTML = html;

    // Update main image if variant has featured media
    if (variant.featured_image?.src) {
      mainImage.style.opacity = '0.3';
      mainImage.src = variant.featured_image.src;
      mainImage.srcset = '';
      mainImage.onload = () => {
        mainImage.style.opacity = '1';
      };
    }

    console.log('Active variant:', variant.title, variant.id);
  }

  // Listen to changes
  document.querySelectorAll('.product-option input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', updateVariantSelection);
  });

  // Initial update (important for pre-selected or URL variant)
  updateVariantSelection();
});





// class VariantSelector extends HTMLElement{
//   constructor(){
//     super();
//     this.product = null;
//     this.variantInput = null;
//   }

//   connectedCallback(){
//     const productJson = document.getElementById('product-data');
//     if (!productJson) return;
    
//     this.product = JSON.parse(productJson.textContent);

//     this.variantInput = this.querySelector('#product-id');
//     if (!this.variantInput) return;

//     this.addEventListener('change', (event) => {
//       if (event.target.matches('.product-option input[type="radio"]')) {
//         this.updateVariant();
//       }
//     });
    
//     this.updateVariant();
//   }
//   updateVariant() {
//     const selectedOptions = [];
    
//     this.querySelectorAll('.product-option input[type="radio"]:checked').forEach((radio) => {
//         selectedOptions.push(radio.value);
//     });

//     const matchedVariant = this.product.variants.find((variant) => {
//       for (let i = 0; i < selectedOptions.length; i++) {
//         if (variant.options[i] !== selectedOptions[i]) {
//           return false;
//         }
//       }
//       return true;
//     });
    
//     if (!matchedVariant) return;
    
//     this.variantInput.value = matchedVariant.id;

//     const url = new URL(window.location.href);
//     url.searchParams.set('variant', matchedVariant.id);
//     history.replaceState({}, '', url.toString());

//     console.log('Matched Variant:', matchedVariant);
//   }
// }


// customElements.define('variant-selector', VariantSelector)

